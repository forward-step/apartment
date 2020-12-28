import React, { memo, useState } from 'react';
import { Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

const Test: React.FC<{}> = (props) => {
	const [tags, setTags] = useState<string[]>(['tag1', 'tag2', 'tag3']);

	// 从tags中删除tag
	const handleClose = (tag: string) => {
		console.info(`closed ${tag}`);
		setTags((tags) => {
			const newTags = tags.filter((item) => item !== tag);
			return newTags;
		});
	};
	const tagChild = tags.map((tag) => {
		return (
			<span key={tag} style={{ display: 'inline-block' }}>
				<Tag
					closable
					onClose={(e) => {
						e.preventDefault();
						handleClose(tag);
					}}>
					{tag}
				</Tag>
			</span>
		);
	});

	return (
		<div style={{ marginBottom: 16 }}>
			<TweenOneGroup
				enter={{
					scale: 0.8,
					opacity: 0,
					type: 'from',
					duration: 100,
					onComplete: (e: any) => {
						e.target.style = '';
					},
				}}
				leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
				appear={false}>
				{tagChild}
			</TweenOneGroup>
		</div>
	);
};

export default memo(Test);