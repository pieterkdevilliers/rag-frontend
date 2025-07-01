export default defineAppConfig({
	ui: {
		horizontalNavigation: {
			wrapper: 'nav-wrapper-class',
			container: 'nav-container-class gap-4',
			inner: 'nav-inner-class',
			base: 'nav-base-class',
			before: 'nav-before-class hover:before:bg-slate-50',
			after: 'nav-after-class hover:after:bg-slate-200',
			active: 'nav-active-class text-primary-600 hover::after:bg-primary-600',
			inactive: 'nav-inactive-class text-slate-500 hover:text-slate-500',
			label: 'nav-label-class font-roboto-condensed text-base font-normal',
			icon: {
				base: 'nav-icon-base-class',
				active: 'nav-icon-active-class text-primary-600',
				inactive: 'nav-icon-inactive-class text-slate-500',
			},
		},
		verticalNavigation: {
			wrapper: 'vertical-nav-wrapper-class px-0 py-2.5 rounded-md',
			base: 'vertical-nav-base-class',
			ring: 'vertical-nav-ring-class',
			padding: 'vertical-nav-padding-class p-3',
			width: 'vertical-nav-width-class',
			rounded: 'vertical-nav-rounded-class',
			font: 'vertical-nav-font-class font-normal',
			size: 'vertical-nav-size-class',
			active: 'vertical-nav-active-class text-primary-600 before:rounded-none before:bg-slate-100',
			inactive: 'vertical-nav-inactive-class',
			label: 'vertical-nav-label-class font-roboto-condensed text-base',
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
