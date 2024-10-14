import React from 'react';

const icons = {
	home: '/assets/icons/home.svg',
	settings: '/assets/icons/settings.svg',
	users: '/assets/icons/users.svg',
	user: '/assets/icons/user.svg',
	message: '/assets/icons/message.svg',
	search: '/assets/icons/search.svg',
	'log-out': '/assets/icons/log-out.svg',
	notification: '/assets/icons/notification.svg',
	visibility: '/assets/icons/visibility.svg',
	'visibility-off': '/assets/icons/visibility-off.svg',
	'status-info': '/assets/icons/status-info.svg',
	'status-warning': '/assets/icons/status-warning.svg',
	'status-danger': '/assets/icons/status-danger.svg',
	add: '/assets/icons/add.svg',
	edit: '/assets/icons/edit.svg',
	delete: '/assets/icons/delete.svg',
	'user-role': '/assets/icons/user-role.svg',
	language: '/assets/icons/language.svg',
	theme: '/assets/icons/theme.svg',
	options: '/assets/icons/options.svg',
	close: '/assets/icons/close.svg',
	checkmark: '/assets/icons/checkmark.svg',
	share: '/assets/icons/share.svg',
	car: '/assets/icons/car.svg',
	download: '/assets/icons/download.svg',
	dot: '/assets/icons/dot.svg',
	markup: '/assets/icons/markup.svg',
	'markup-minimum': '/assets/icons/markup-minimum.svg',
	showcase: '/assets/icons/showcase.svg',
	order: '/assets/icons/order.svg',
	'order-completed': '/assets/icons/order-completed.svg',
	partners: '/assets/icons/partners.svg',
	newsletter: '/assets/icons/newsletter.svg',
	'arrow-back': '/assets/icons/arrow-back.svg',
	'arrow-forward': '/assets/icons/arrow-forward.svg',
	'arrow-linked': '/assets/icons/arrow-linked.svg',
	'chevron-down': '/assets/icons/chevron-down.svg',
	'chevron-up': '/assets/icons/chevron-up.svg',
	'chevron-left': '/assets/icons/chevron-left.svg',
	'chevron-right': '/assets/icons/chevron-right.svg',
	'dropdown-arrow': '/assets/icons/dropdown-arrow.svg',
	phone: '/assets/icons/phone.svg',
	email: '/assets/icons/email.svg',
	sun: '/assets/icons/sun.svg',
	moon: '/assets/icons/moon.svg',
	delivery: '/assets/icons/delivery.svg'
};

export type IconName = keyof typeof icons;

export const Icon: React.FC<{
	icon: IconName;
	size?: string | number;
	className?: string;
}> = ({ icon, size, className }) => {
	return (
		<div
			className={'transition-all ease-in duration-200 '.concat(
				className ? className : 'bg-neutral'
			)}
			style={{
				height: size ? size : '24px',
				width: size ? size : '24px',
				WebkitMaskImage: `url('${icons[icon]}')`,
				maskImage: `url('${icons[icon]}')`,
				WebkitMaskRepeat: 'no-repeat',
				WebkitMaskSize: 'contain',
				WebkitMaskPosition: 'center center',
				maskRepeat: 'no-repeat'
			}}
		/>
	);
};
