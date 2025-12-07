const mapEnumToOptions = <T extends object>(enumObj: T) => {
	return Object.entries(enumObj).map(([key, value]) => ({
		label: value as string,
		value: key as keyof T
	}))
}
export default mapEnumToOptions
