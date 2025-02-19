//import prisma from '$lib/prisma.js';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia, client } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const actions = {
	default: async ({ request, cookies }) => {
		console.log('register');
		const data = await request.formData();
		const { name, email, password, genres } = Object.fromEntries(data) as Record<string, string>;
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);
		const user = await client.user.create({
			data: {
				id: userId,
				name: name,
				email: email,
				password: hashedPassword
			}
		});

		// Populate preferred genres
		const genres_decoded = JSON.parse(genres) as Array<{ index: number, value: number, label: string }>;
		for (const genre of genres_decoded) {
			console.log("Add genre: " + genre.value + " (" + genre.label + ") to user " + user.id);
			await prisma.userGenre.create({
				data: {
					userId: user.id,
					genreId: genre.value
				}
			});
		}

		// Generate session
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/newuser/findmovies');
	}
};
