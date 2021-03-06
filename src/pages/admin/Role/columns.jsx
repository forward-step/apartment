import Accounts from './Accounts';
const columns = [
	{
		title: '角色名称',
		dataIndex: 'rolename',
		width: '20%',
		editable: true,
		rules: [
			{
				required: true,
				message: '角色名称不能为空',
			},
		],
		sorter: {
			compare: (a, b) => a.rolename.localeCompare(b.rolename),
			multiple: 2,
		},
		search: true,
	},
	{
		title: '角色描述',
		dataIndex: 'remark',
		width: '30%',
		editable: true,
		rules: [
			{
				required: true,
				message: '角色描述不能为空',
			},
		],
		sorter: {
			compare: (a, b) => a.rolename.localeCompare(b.rolename),
			multiple: 1,
		},
		search: true,
	},
	{
		title: '管理员(人数)',
		dataIndex: 'accounts',
		sorter: {
			compare: (a, b) => a.accounts > b.accounts,
			multiple: 1,
		},
		// 建议展示数字
		// 弹出modal，展示该角色下所有的用户
		render: (accounts, record) => (
			<Accounts accounts={accounts} record={record} />
		),
	},
];
export default columns;
