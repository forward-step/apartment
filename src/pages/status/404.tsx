import React from 'react';
import { Result, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import { useTitle } from '../../js';

const NotFount: React.FC<{
	url: string;
}> = (props) => {
	useTitle('404');
	return (
		<Result
			status='404'
			title='404'
			subTitle='对不起, 你访问的页面不存在.'
			extra={
				<Button type='primary'>
					<NavLink to={props.url}>返回到首页</NavLink>
				</Button>
			}
		/>
	);
};

export default NotFount;
