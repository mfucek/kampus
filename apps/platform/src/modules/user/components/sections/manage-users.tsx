'use client';

import { type FC, useState } from 'react';

import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/lib/shadcn/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { type ListAccountsItem } from '@/modules/account/api/procedures/list';
import { PermissionsTable } from '@/modules/permissions/components/permissions-table';
import { RuleType } from '@prisma/client';

const AccountSection: FC<{ account: ListAccountsItem }> = ({ account }) => {
	const utils = api.useUtils();

	const { data: permissions } = api.account.permissions.list.useQuery({
		accountId: account.id
	});

	const { mutateAsync: addPermission } =
		api.account.permissions.add.useMutation({
			onSuccess: async () => {
				await utils.account.permissions.list.invalidate();
			}
		});

	const { data: colleges } = api.college.listAll.useQuery();

	const [rule, setRule] = useState<RuleType | null>(null);
	const [scopeId, setScopeId] = useState<string | null>(null);
	// const [scopeType, setScopeType] = useState<ScopeType>('GLOBAL');
	const [value, setValue] = useState<boolean>(true);

	const handleAddPermission = async () => {
		if (!rule || !scopeId) return;

		await addPermission({
			accountId: account.id,
			rule: rule,
			scopeId: scopeId ?? null,
			scopeType: scopeId ? 'COLLEGE' : 'GLOBAL',
			value: value
		});

		setRule(null);
		setScopeId(null);
		// setScopeType('GLOBAL');
		setValue(true);
	};

	return (
		<ContentPadding size="lg">
			<div className="flex flex-col gap-2">
				<Dialog>
					<div className="flex flex-row justify-between">
						{account.user.displayName}
						<DialogTrigger asChild>
							<Button variant={'solid-weak'}>
								<Icon icon="add" />
								Add
							</Button>
						</DialogTrigger>
					</div>

					<DialogContent>
						<DialogHeader className="hidden">
							<DialogTitle>Add Permission</DialogTitle>
							<DialogDescription>
								Add a permission to the account.
							</DialogDescription>
						</DialogHeader>

						<DialogBody className="p-6 flex flex-col gap-10">
							<div className="flex flex-row gap-2">
								<Select
									value={rule ?? undefined}
									onValueChange={(value) => setRule(value as RuleType)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Rule" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(RuleType).map((rule) => (
											<SelectItem value={rule} key={rule}>
												{rule}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{/* <Select
								value={scopeType}
								onValueChange={(value) => setScopeType(value as ScopeType)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Scope" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="GLOBAL">Global</SelectItem>
									<SelectItem value="COLLEGE">College</SelectItem>
								</SelectContent>
							</Select> */}
							</div>

							{/* <Input
							placeholder="Scope ID"
							value={scopeId ?? ''}
							onChange={(e) => setScopeId(e.target.value)}
						/> */}

							<Select
								value={scopeId ?? ''}
								onValueChange={(value) => setScopeId(value)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Scope" />
								</SelectTrigger>
								<SelectContent>
									{colleges?.map((college) => (
										<SelectItem value={college.id} key={college.id}>
											{college.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={value ? 'true' : 'false'}
								onValueChange={(value) => setValue(value === 'true')}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Scope" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">True</SelectItem>
									<SelectItem value="false">False</SelectItem>
								</SelectContent>
							</Select>

							<Button onClick={handleAddPermission}>
								<Icon icon="add" />
								Add
							</Button>
						</DialogBody>
					</DialogContent>
				</Dialog>

				<PermissionsTable permissions={permissions ?? []} />
			</div>
		</ContentPadding>
	);
};

export const ManageUsersSection: FC = () => {
	const { data: accounts } = api.account.list.useQuery();

	return (
		<div className="flex flex-col gap-4">
			{accounts?.map((account) => (
				<AccountSection account={account} key={account.id} />
			))}
		</div>
	);
};
