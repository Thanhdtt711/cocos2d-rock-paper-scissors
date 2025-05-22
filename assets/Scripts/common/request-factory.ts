import { sys } from 'cc'

export const $fetch = async (url: string, options?: RequestInit) => {
	return new Promise((resolve, reject) => {
		const token = sys.localStorage.getItem('token')
		fetch(url, {
			...options,
			headers: {
				...options?.headers,
				Authorization: token ? `Bearer ${token}` : '',
			},
		})
			.then((response: Response) => {
				return response.json()
			})
			.then((value) => {
				resolve(value)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export class RequestFactory {
	static getLobbyList() {
		return $fetch('http://localhost:3000/rooms')
	}
}
