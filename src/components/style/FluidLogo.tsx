import type React from "react";

/**
 * Logo adapted from https://freesvg.org/water-drop-vector-graphics
 */

export const FluidLogo: React.FunctionComponent = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="svg3659"
			viewBox="0 0 97.654 150.78"
			version="1.1"
			style={{ height: "1.5em", width: "1.5em", marginBottom: "-0.3em" }}
		>
			<title>Fluid Chat Logo</title>
			<defs id="defs3661">
				<radialGradient
					id="radialGradient5715"
					gradientUnits="userSpaceOnUse"
					cy="475"
					cx="281.96"
					gradientTransform="matrix(1.0933 .038634 -.054783 1.5503 -.28742 -269.16)"
					r="20.596"
				>
					<stop id="stop5622" style={{ stopColor: "#48e6f3" }} offset="0" />
					<stop id="stop5626" style={{ stopColor: "#9237e3" }} offset=".5" />
					<stop id="stop5624" style={{ stopColor: "#6e06e9" }} offset="1" />
				</radialGradient>
				<radialGradient
					id="radialGradient5717"
					gradientUnits="userSpaceOnUse"
					cy="484.58"
					cx="307.11"
					gradientTransform="matrix(.98540 .22972 -.26941 2.1034 135.04 -605.84)"
					r="16.703"
				>
					{/* 51e6ff = light blue
          48e6f3 = lightish blue
          9237e3 = mid purple
          6e06e9 = dark purple
           */}
					<stop id="stop5704" style={{ stopColor: "#51e6ff" }} offset="0" />
					<stop
						id="stop5706"
						style={{ stopColor: "#51e6ff", stopOpacity: 0 }}
						offset="1"
					/>
				</radialGradient>
				<filter
					id="filter5644"
					width="1.523"
					y="-.20458"
					x="-.26150"
					height="1.4092"
					colorInterpolationFilters="sRGB"
				>
					<feGaussianBlur id="feGaussianBlur5646" stdDeviation="2.3899464" />
				</filter>
				<filter
					id="filter5692"
					width="1.8953"
					y="-.27438"
					x="-.44767"
					height="1.5488"
					colorInterpolationFilters="sRGB"
				>
					<feGaussianBlur id="feGaussianBlur5694" stdDeviation="1.7720207" />
				</filter>
			</defs>
			<g id="layer1" transform="translate(-314.03 -291.55)">
				<g id="g5710" transform="matrix(1.7938 0 0 1.7938 -154.34 -475.17)">
					<path
						id="path5473"
						d="m292.46 427.42c-23.118 19.515-41.497 52.603-22.655 75.977 13.793 12.849 34.584 10.14 42.325-6.4898 14.05-30.748-26.8-39.798-19.669-69.487z"
						style={{ fill: "url(#radialGradient5715)" }}
					/>
					<path
						id="path5475"
						style={{
							// filter: "url(#filter5644)",
							fill: "url(#radialGradient5717)",
						}}
						d="m289.64 504.76c9.8911-2.8925 12.601-12.313 15.221-21.816 0.27934-8.9169 8.5417-8.2332 6.3419 2.0294-3.3987 11.842-9.4036 20.075-21.562 19.787z"
						transform="matrix(1 0 0 .74123 -1.7678 132.62)"
					/>
					<path
						id="path5481"
						style={{
							opacity: 0.88496,
							filter: "url(#filter5692)",
							fill: "#51e6ff",
						}}
						d="m-290.5 426.61c0 4.2802-2.1266 7.75-4.75 7.75s-4.75-3.4698-4.75-7.75 2.1266-7.75 4.75-7.75 4.75 3.4698 4.75 7.75z"
						transform="matrix(-1.6251 -.38171 -.37372 1.591 -43.921 -313.07)"
					/>
				</g>
			</g>
		</svg>
	);
};
