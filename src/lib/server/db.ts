/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3 from 'sqlite3';
import type { Database } from 'sqlite';
import { open } from 'sqlite';
import { hashPassword, getRandomBytes, verifyPassword } from '$lib/utils';

let db: Database;

async function checkDB() {
	if (!db) {
		db = await open({
			filename: './napcloud.db',
			driver: sqlite3.Database
		});
		await db.run(
			'CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT NOT NULL, salt TEXT NOT NULL);'
		);
		await db.run(
			'CREATE TABLE IF NOT EXISTS sessions (id TEXT NOT NULL UNIQUE, user TEXT PRIMARY KEY, expires INTEGER NOT NULL);'
		);
		await db.run(
			'CREATE TABLE IF NOT EXISTS files (path TEXT NOT NULL UNIQUE, visible BOOLEAN DEFAULT 0);'
		);
	}
}

export async function createUser(
	email: string,
	password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
	await checkDB();
	const user = await db.get('SELECT * FROM users WHERE email = ?', email);
	if (user) {
		return {
			success: false,
			error: 'User already exists'
		};
	}

	const { hash, salt } = await hashPassword(password);
	await db.run('INSERT INTO users (email, password, salt) VALUES (?, ?, ?)', email, hash, salt);
	const randomToken = await getRandomBytes();
	const then = Date.now() + 1000 * 60 * 60 * 24 * 7;
	await db.run(
		'INSERT INTO sessions (id, user, expires) VALUES (?, ?, ?)',
		randomToken,
		email,
		then
	);

	return {
		success: true,
		token: randomToken
	};
}

export async function verifyUser(email: string, password: string) {
	await checkDB();
	const user = await db.get('SELECT * FROM users WHERE email = ?', email);
	if (!user) {
		return {
			success: false,
			error: "User doesn't exist"
		};
	}
	const authorized = await verifyPassword(password, user.salt, user.password);
	if (!authorized) {
		return {
			success: false,
			error: 'Incorrect password or email'
		};
	}
	const randomToken = await getRandomBytes();
	const then = Date.now() + 1000 * 60 * 60 * 24 * 7;

	await db.run(
		'INSERT INTO sessions (id, user, expires) VALUES (?, ?, ?) ON CONFLICT (user) DO UPDATE SET id = ?, expires = ?',
		randomToken,
		email,
		then,
		randomToken,
		then
	);

	return {
		success: true,
		token: randomToken
	};
}

export async function checkToken(sessionid: string | undefined) {
	if (!sessionid) {
		return {
			success: false,
			error: 'Invalid session'
		};
	}

	await checkDB();
	const session = await db.get('SELECT * FROM sessions WHERE id = ?', sessionid);
	if (!session || session.expires < Date.now())
		return {
			success: false,
			error: 'Invalid session'
		};
	return {
		success: true,
		user: session.user
	};
}

function checkFilePath(filePath: string) {
	filePath = filePath.replaceAll('//', '/');
	if (filePath.endsWith('/')) filePath = filePath.slice(0, -1);
	if (!filePath.startsWith('/')) filePath = '/' + filePath;
	return filePath;
}

export async function setFileVisibility(filePath: string, visible: boolean) {
	await checkDB();
	const _visible = visible === true ? 1 : 0;
	filePath = checkFilePath(filePath);
	await db.run(
		'INSERT INTO files (path, visible) VALUES (?, ?) ON CONFLICT (path) DO UPDATE SET visible=? WHERE path=?',
		filePath,
		_visible,
		_visible,
		filePath
	);
}

export async function isFilePublic(filePath: string) {
	await checkDB();
	filePath = checkFilePath(filePath);
	const file = await db.get('SELECT * FROM files WHERE path = ?', filePath);
	if (file && file.visible === 1) return true;
	return false;
}
