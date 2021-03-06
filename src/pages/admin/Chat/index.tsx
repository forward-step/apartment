import React, { memo, useCallback, useRef } from 'react';
import { useTitle, useWebSocket, classNames } from '../../../js';
import useFriends, { IFriend } from './useFriends';
import style from './index.module.scss';
import {
	Chat as ChatComponent,
	IChatImperativeHandle,
} from '../../../components';
import { websocketBaseURL } from '../../../config';
import { useUserStore } from '../../../store/userRedcer/dispatch';
import FriendSkeleton from './friend-skeleton';
import FriendItem from './friend-item';
import InfoRoomer from './info-roomer';

const cls = classNames.bind(style);

interface IPros {}
const Chat: React.FC<IPros> = (props) => {
	// 修改html标题
	useTitle('聊天管理');
	const userStore = useUserStore();

	/**
	 * 获取Chat组件暴露的方法
	 */
	const chatRef = useRef<IChatImperativeHandle>(null);

	/**
	 * 管理朋友列表
	 */
	const { friends, friendsLoading, updateFriend } = useFriends();

	/**
	 * 记录当前聊天的用户
	 */
	const currentFriendRef = useRef<IFriend | null>(null);

	/**
	 * 连接聊天服务器
	 */
	const { disable, sendContent } = useWebSocket(
		`${websocketBaseURL}/${userStore.token}`,
		(receive) => {
			try {
				let data = JSON.parse(receive) as {
					userid: number;
					content: string;
					username: string;
				};
				if (typeof data.userid === 'string') {
					data.userid = parseInt(data.userid);
				}
				console.info(currentFriendRef.current?.userid);
				console.info(data.userid);
				// 1.更新朋友列表
				if (
					currentFriendRef.current &&
					currentFriendRef.current.userid === data.userid
				) {
					// 信息是打开窗口的人发送的
					updateFriend(data.userid, () => 0, data.content);
					// 2.更新聊天页面
					if (chatRef.current) {
						chatRef.current.appendChat(data.content, false);
					}
				} else {
					// 信息是其他窗口发来的
					updateFriend(
						data.userid,
						(unread) => unread + 1,
						data.content
					);
					// 告诉服务器，我有未读信息
				}
			} catch (e) {
				console.info(`数据传输异常，请联系管理员`);
			}
		}
	);

	// 切换用户
	const handleChange = useCallback(
		(friend: IFriend) => {
			// 1.清除未读信息
			updateFriend(friend.userid, () => 0);
			// 2.保存当前用户信息
			currentFriendRef.current = friend;
		},
		[updateFriend]
	);

	/**
	 * 发送内容
	 */
	const handleSend = useCallback(
		(content: string) => {
			if (!!currentFriendRef.current) {
				if (chatRef.current) {
					// 发送信息到服务器
					sendContent(currentFriendRef.current.userid, content);
					// 追加内容到聊天信息
					chatRef.current.appendChat(content);
					// 更新朋友列表
					updateFriend(
						currentFriendRef.current.userid,
						() => 0,
						content
					);
				}
			}
		},
		[sendContent, updateFriend]
	);

	return (
		<div className={cls('container')}>
			{/* 左侧的朋友列表 */}
			<div className={cls('friends--left')}>
				{friendsLoading ? (
					<>
						{Array.from({ length: 6 }).map((_, index) => (
							<FriendSkeleton key={index} />
						))}
					</>
				) : (
					<>
						{friends.map((friend) => {
							return (
								<div
									key={friend.userid}
									onClick={() => {
										handleChange(friend);
									}}>
									<FriendItem
										friend={friend}
										active={
											friend.userid ===
											currentFriendRef.current?.userid
										}
									/>
								</div>
							);
						})}
					</>
				)}
			</div>
			{/* 中间的租客信息 */}
			{!!currentFriendRef.current ? (
				<div
					key={currentFriendRef.current.userid}
					className={cls('info--middle')}>
					<InfoRoomer
						user={currentFriendRef.current}
						sendContent={handleSend}
					/>
				</div>
			) : null}
			{/* 右侧的聊天窗口 */}
			<div
				hidden={!currentFriendRef.current}
				className={cls('chat--right')}>
				{currentFriendRef.current !== null ? (
					<ChatComponent
						ref={chatRef}
						isAdmin={true}
						userid={currentFriendRef.current.userid}
						username={currentFriendRef.current.username}
						buttonOptions={{
							disabled: disable,
							text: disable ? '连接聊天服务器失败' : '发送',
							callback: handleSend,
						}}
					/>
				) : null}
			</div>
		</div>
	);
};
export default memo(Chat);
