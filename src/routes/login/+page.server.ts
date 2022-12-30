import type { Actions } from './$types';
import { createUser, verifyUser } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { SECRET_DISABLE_NEW_USERS } from '$env/static/private';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (email && password) {
			const { success, token, error } = await verifyUser(email, password);
			if (!success) {
				return {
					success,
					error
				};
			}
			if (token)
				cookies.set('sessionid', token, {
					expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
				});
			throw redirect(303, '/');
		} else {
			return {
				success: false,
				error: 'Missing email or password'
			};
		}
	},
	register: async ({ request, cookies }) => {
		if (SECRET_DISABLE_NEW_USERS.toLocaleLowerCase() === 'true') {
			return {
				success: false,
				error: 'New users are disabled'
			};
		}
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (email && password) {
			const { success, error, token } = await createUser(email, password);
			if (success) {
				if (token)
					cookies.set('sessionid', token, {
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
					});
				throw redirect(303, '/');
			} else {
				return {
					success,
					error
				};
			}
		}
		return {
			success: false,
			error: 'Missing email or password'
		};
	}
};
