export function DoneFill(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
			<title>done-fill</title>
			<mask
				id="SVGDM1w6dIU"
				width="21"
				height="19"
				x=".774"
				y="2.367"
				fill="#000"
				maskUnits="userSpaceOnUse"
			>
				<path fill="#fff" d="M.774 2.367h21v19h-21z" />
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M18.774 6.633L9.167 18.375L4.4 14.8l1.2-1.6l3.233 2.425l8.393-10.258z"
					clipRule="evenodd"
				/>
			</mask>
			<path
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="4"
				d="M18.774 6.633L9.167 18.375L4.4 14.8l1.2-1.6l3.233 2.425l8.393-10.258z"
				clipRule="evenodd"
				mask="url(#SVGDM1w6dIU)"
			/>
		</svg>
	)
}

export default DoneFill
