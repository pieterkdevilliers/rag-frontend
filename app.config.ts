export default defineAppConfig({
	ui: {
		horizontalNavigation: {
			wrapper: 'nav-wrapper-class',
			container: 'nav-container-class gap-4',
			inner: 'nav-inner-class',
			base: 'nav-base-class px-2.5 py-1.5 rounded-md',
			before: 'nav-before-class hover:bg-primary-600',
			after: 'nav-after-class',
			active: 'nav-active-class bg-primary-600 hover:bg-primary-500 hover:before:bg-primary-500 after:bg-transparent',
			inactive:
				'nav-inactive-class bg-primary-500 hover:bg-primary-600 hover:before:bg-primary-600',
			label: 'nav-label-class text-white font-normal',
			icon: {
				base: 'nav-icon-base-class group-hover:text-white',
				active: 'nav-icon-active-class text-white group-hover:text-white',
				inactive:
					'nav-icon-inactive-class text-white group-hover:text-white',
			},
		},
		verticalNavigation: {
			wrapper: 'vertical-nav-wrapper-class px-0 py-2.5 rounded-md',
			base: 'vertical-nav-base-class',
			ring: 'vertical-nav-ring-class',
			padding: 'vertical-nav-padding-class',
			width: 'vertical-nav-width-class',
			rounded: 'vertical-nav-rounded-class',
			font: 'vertical-nav-font-class font-light',
			size: 'vertical-nav-size-class',
			active: 'vertical-nav-active-class text-primary-600 before:rounded-none before:bg-slate-100',
			inactive: 'vertical-nav-inactive-class',
			label: 'vertical-nav-label-class',
			icon: {
				base: 'vertical-nav-icon-base-class font-light',
				active: 'vertical-nav-icon-active-class text-primary-600',
				inactive: 'vertical-nav-icon-inactive-class',
			},
			divider: {
				wrapper: {
					base: 'vertical-nav-divider-wrapper-base-class',
				},
			},
		},
		card: {
			base: 'card-grid__card',
			header: {
				base: 'card__header',
			},
			body: {
				base: 'card__body',
			},
			footer: {
				base: 'card__footer',
			},
		},
		button: {
			rounded: 'rounded-md',
		},
		accent: 'pink',
		primary: 'pink',
		gray: 'cool',
	},
});
