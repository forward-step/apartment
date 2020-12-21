import React, { memo, useEffect, useState } from 'react';
import { useRequest, useScrollLoader } from '../../../../utils';
import { RoomCard, Room } from '../../../../components';
import { useRoomStore } from '../../../../store/RoomReducer/dispatch';
import { Spin, Empty, BackTop } from 'antd';
import style from './index.module.scss';
import { defaultPageSize } from '../../../../config';

interface PostDataType {
	current: number;
	pageSize: number;
	price: {
		min: number | undefined;
		max: number | undefined;
	};
	area: {
		min: number | undefined;
		max: number | undefined;
	};
	dir: string;
}
interface ResDataType {
	hasNextPage: boolean;
	list: Room[];
	pageNum: number;
	pageSize: number;
}

interface IPros {}
const defaultProps = {};
const Rooms: React.FC<IPros> = (props) => {
	const store = useRoomStore();
	const [currentPage, setCurrentPage] = useState(0); // 当前页数
	const [hasNextPage, setHasNextPage] = useState(false); // 是否还有下一页
	const [data, setData] = useState<Room[]>([]); // 数据源
	/**
	 * 实现加载数据
	 */
	const { run: temprun } = useRequest<ResDataType, PostDataType>(
		'/home/room/findAll',
		{
			onSuccess: ({ data }) => {
				setHasNextPage(data.hasNextPage);
				setCurrentPage(data.pageNum);
				setData((source) => {
					const newData = [];
					// 判断是否为第一页
					if (data.pageNum !== 1) {
						newData.push(...source);
					}
					newData.push(...data.list);
					return newData;
				});
			},
		}
	);
	// 主要用于处理参数
	const run = (currentPage: number) => {
		temprun({
			current: currentPage,
			pageSize: defaultPageSize,
			price: {
				min: store.price.min,
				max: store.price.max,
			},
			area: {
				min: store.area.min,
				max: store.area.max,
			},
			dir: store.dir.content,
		});
	};
	/**
	 * 滚动加载 - 事件节流，300ms内再次触发会被抛弃
	 */
	useScrollLoader('#scroll', () => {
		if (hasNextPage) {
			console.info(`加载数据ing`);
			run(currentPage + 1);
		}
	});
	/**
	 * 监听filter的变化
	 */
	useEffect(() => {
		run(1); // 页数重新更新
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.price, store.area, store.dir.content]);
	return (
		<>
			<BackTop />
			<div
				style={{
					marginTop: '51px',
				}}>
				{data.map((room, index) => (
					<RoomCard key={index} room={room} />
				))}
				<div
					id='scroll'
					style={{
						height: '300px',
					}}>
					{hasNextPage ? (
						<Spin className={style.loadMore} size='large' />
					) : (
						<Empty description='没有数据了' />
					)}
				</div>
			</div>
		</>
	);
};
Rooms.defaultProps = defaultProps;
export default memo(Rooms);
