import { lucia } from '$lib/server/auth'; // Assuming you have a custom utility to get the session
import { PrismaClient } from '@prisma/client';
import type { TMDBMovieDetailsItem, TMDBMovieSearchItem, TMDBMovieSearchResponse } from '$lib/server/tmdb.js';

const prisma = new PrismaClient();

async function fillRemainingRecommendations(recommendations : TMDBMovieDetailsItem[], existing : number[], ourRatings : number[], tmdbGenreIds : number[]) {
    console.log("Filling remaining recommendations...");

    // Fetch trending movies from TMDB API, filling the recommendations up to 20
    try {
        let page = 1
        let results : TMDBMovieSearchItem[] | null = null;

        while (recommendations.length < 20 && (results == null || results?.length > 0)) {
            console.log("Have " + recommendations.length + " recommendations, fetching page " + page + "...");
            const response : TMDBMovieSearchResponse = await (await fetch("https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=" + page + "&api_key=" + process.env.TMDB_API_KEY)).json();
            
            results = response.results;
            page = page + 1;

            for (let i = 0; i < results.length; i++) {
                if (recommendations.length >= 20) {
                    break;
                }

                if (results[i].release_date > new Date().toISOString().split('T')[0]) {
                    console.log("Rejected " + results[i].title + " (id: " + results[i].id + ") because it is not released yet.");
                    continue;
                }

                if (recommendations.map((el) => el.id).includes(results[i].id)) {
                    console.log("Rejected " + results[i].title + " (id: " + results[i].id + ") because we already have it in our recommendations.");
                    continue;
                }

                if (existing.includes(results[i].id)) {
                    console.log("Rejected " + results[i].title + " (id: " + results[i].id + ") because we already have it in our recommendations (2).");
                    continue;
                }

                if (ourRatings.includes(results[i].id)) {
                    console.log("Rejected " + results[i].title + " (id: " + results[i].id + ") because we have already seen it.");
                    continue;
                }

                let matchesGenre = false;
                for (let j = 0; j < results[i].genre_ids.length; j++) {
                    if (tmdbGenreIds.includes(results[i].genre_ids[j])) {
                        matchesGenre = true;
                    }
                }

                if (!matchesGenre) {
                    console.log("Rejected " + results[i].title + " (id: " + results[i].id + ") because it does not match our genres.");
                    continue;
                }

                try {
                    const details : TMDBMovieDetailsItem = await (await fetch("https://api.themoviedb.org/3/movie/" + results[i].id + "?api_key=" + process.env.TMDB_API_KEY)).json();
                    console.log("Accepted " + details.title + " (id: " + details.id + ") from TMDB.");
                    recommendations.push(details);
                }
                catch (e) {
                    console.error(e);
                    continue;
                }
            }
        }
    }
    catch (e) {
        console.error(e);
    }

    console.log("Existing: " + existing);
    return recommendations;

}

export async function GET({ request, url }) {
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = lucia.readSessionCookie(cookieHeader ?? "");
    if (!sessionId) {
        return new Response(null, {
            status: 401
        });
    }
    const { session, user } = await lucia.validateSession(sessionId);

    if (!user) {
        return new Response(null, {
            status: 401
        });
    }

    const existing = url.searchParams.get('exclude')?.split(',').map((el) => Number(el)) ?? [];

    console.log("User " + user.id + " (" + user.name + ") wants a recommendation!");

    // Get our genres
    const genres = await prisma.userGenre.findMany(
        { 
            where: { 
                userId: user.id 
            } 
        }
    );

    const genreIds = genres.map((genre) => genre.genreId);

    // Get all genre definitions of genres we like
    const tmdbGenres = await prisma.genre.findMany(
        { 
            where: { 
                id: { in: genreIds }
            } 
        }
    );

    const tmdbGenreIds = tmdbGenres.map((genre) => genre.tmdbMovieId);

    // Get our ratings
    const ourRatings = await prisma.userRating.findMany(
        { 
            where: { 
                userId: user.id,
                type: "movie"
            } 
        }
    );

    // Get users that share our genres
    const users = await prisma.userGenre.findMany(
        { 
            where: { 
                genreId: { in: genreIds },
                userId: { not: user.id }
            } 
        }
    );

    let uniqueUsers = [...new Set(users.map(user => user.userId))];

    let tries = 0;
    let recommendations : TMDBMovieDetailsItem[] = [];
    while (true) {
        
        if (tries > 100) {
            console.log("Too many tries. Returning recommendations.");
            
            recommendations = await fillRemainingRecommendations(recommendations, existing, ourRatings.map((el) => el.tmdbId), tmdbGenreIds);

            return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        if (recommendations.length == 20) {
            console.log("Found all recommendations!")
            
            return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        console.log("Attempting to find recommendation " + (recommendations.length + 1) + " of 20...");
        // console.log(recommendations);
    
        // Select a random user from the list of users that share our genres
        const selectedUserIndex = Math.floor(Math.random() * uniqueUsers.length);
        console.log("Chose user " + (selectedUserIndex + 1) + " of " + uniqueUsers.length);
        const randomUser = uniqueUsers[selectedUserIndex];
        if (!randomUser) {
            console.log("No users found. Returning recommendations.");

            recommendations = await fillRemainingRecommendations(recommendations, existing, ourRatings.map((el) => el.tmdbId), tmdbGenreIds);

            return new Response(JSON.stringify({ error: false, recommendations: recommendations }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    
        // Get the score of this user, which determines the chance that they will be the chosen one
        // This is the number of matching ratings over the number of total shared ratings
        // If the number is 0, then give a 10% chance of choosing this user anyways
        const ourRatedIds = ourRatings.map((rating) => rating.tmdbId);
        const userRatings = await prisma.userRating.findMany(
            { 
                where: { 
                    userId: randomUser
                } 
            }
        ).then((userRatings) => userRatings.filter(
            (rating) => rating.rating !== 'unrated' && !recommendations.map((el) => el.id).includes(rating.tmdbId)
        ));

        //console.log("User ratings: " + JSON.stringify(userRatings))

        // This user has no ratings (new user?), so skip them and remove them from the pool
        if (userRatings.length === 0) {
            console.log("User " + randomUser + " has no ratings. Skipping...");
            uniqueUsers = uniqueUsers.filter((id) => id !== randomUser);
            tries++;
            continue;
        }

        // Decide whether we choose this user
	console.log(userRatings.map((rating) => rating.tmdbId))
	console.log(ourRatedIds)
        const sharedRatings = userRatings.filter((rating) => ourRatedIds.includes(rating.tmdbId));

        if (sharedRatings.length === 0) {
            console.log("User " + randomUser + " has no ratings in common.");

            if (Math.random() > 0.1) {
                tries++;
                continue;
            }
        } else {
            let sharedRatingsCount = 0
			sharedRatings.forEach((rating) => {
				const match = ourRatings.find((ourRating) => ourRating.tmdbId == rating.tmdbId)?.rating ?? 'unrated';
				if (match == rating.rating) {
					sharedRatingsCount++;
				}
			})

			const score = sharedRatingsCount / sharedRatings.length;
            
            console.log("Score for user " + randomUser + ": " + score);
    
            if (Math.random() > score) {
                tries++;
                continue;
            }
        }
        
        console.log("User " + randomUser + " was chosen.");

        // Add a recommendation based on what this user liked
        const userLiked = userRatings.filter(
            (rating) => rating.rating == 'positive' && !ourRatedIds.includes(rating.tmdbId) && !existing.includes(rating.tmdbId)
        );

        const userRecommendationsPromise = userLiked.flatMap(async (rating) => {
            const ratingGenres = await prisma.ratingGenre.findMany({
                where: {
                    userId: randomUser,
                    tmdbId: rating.tmdbId
                }
            })

            if (rating.type !== 'movie') {
                return []
            }

            let isLikedGenre = false;
            for (let i = 0; i < ratingGenres.length; i++) {
                if (genreIds.includes(ratingGenres[i].genreId)) {
                    isLikedGenre = true;
                    break;
                }
            }

            if (isLikedGenre) {
                return Array(10).fill(rating);  
            } else {
                return [rating];
            }
        })

        const userRecommendations = await Promise.all(userRecommendationsPromise).then((values) => values.flatMap((value) => value));

        if (userRecommendations.length === 0) {
            console.log("User " + randomUser + " has no recommendations. Skipping...");
            uniqueUsers = uniqueUsers.filter((id) => id !== randomUser);
            tries++;
            continue;
        }
        
        const recommendedMovieId = userRecommendations[Math.floor(Math.random() * userRecommendations.length)].tmdbId;

        // Query TMDB APIfor the movie with this tmdbId
        try {
            const recommendedMovie : TMDBMovieDetailsItem = await (await fetch("https://api.themoviedb.org/3/movie/" + recommendedMovieId + "?api_key=" + process.env.TMDB_API_KEY)).json();
            
            recommendations.push(recommendedMovie);
        }
        catch (e) {
            console.error(e);
            continue;
        }
    }
}
