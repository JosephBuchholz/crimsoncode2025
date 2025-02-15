// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			//user: import('$lib/server/auth').SessionValidationResult['user'];
			//session: import('$lib/server/auth').SessionValidationResult['session'];

			// from tutorial:
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}
}

export {};
