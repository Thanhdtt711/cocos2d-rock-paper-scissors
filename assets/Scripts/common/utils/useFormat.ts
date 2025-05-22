export function formatString(str: string | null, begin = 5, last = 5): string {
	if (!str) return ''
	if (str.length <= begin + last) return str
	const before = str.substring(0, begin)
	const after = str.substring(str.length - last)
	return before + '...' + after
}
