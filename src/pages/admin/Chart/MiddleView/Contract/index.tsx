import React, { useState, useEffect, useRef } from 'react';
import CommonCard from '../components/CommonCard';
import { useChart, useRequest } from '../../../../../js';
import moment from 'moment';

const Contract = () => {
	const chartDom = useRef<HTMLDivElement>(null);
	const [xAxis, setXAxis] = useState<string[]>([]);
	const [num, setNum] = useState<string[]>([]);
	const [price, setPrice] = useState<string[]>([]);

	useChart(
		chartDom,
		{
			title: {
				text: '合同订单详情',
				textStyle: {
					fontSize: 12,
					color: '#666',
				},
				left: 25,
			},
			xAxis: {
				type: 'category',
				data: xAxis,
			},
			yAxis: [
				{
					type: 'value', // 坐标轴类别
					boundaryGap: [0.2, 0.2], // Y轴的间隙
					// 分割线样式
					splitLine: {
						lineStyle: {
							type: 'dotted',
							color: '#eee',
						},
					},
				},
				{
					type: 'value', // 坐标轴类别
					boundaryGap: [0.2, 0.2], // Y轴的间隙
					// 分割线样式
					splitLine: {
						show: false,
					},
				},
			],
			series: [
				{
					name: '签订合同数量',
					type: 'bar',
					barWidth: '35%',
					data: num,
					yAxisIndex: 0, // 表示对应index = 0的Y坐标
				},
				{
					name: '合同的价值',
					type: 'bar',
					barWidth: '35%',
					data: price,
					yAxisIndex: 1, // 表示对应index = 1的Y坐标
				},
			],
			color: ['#3398DB'],
			toolbox: {
				feature: {
					dataZoom: {}, // 缩放与还原
					restore: {}, // 刷新
					saveAsImage: {}, // 保存为图片
				},
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					// 坐标轴指示器，坐标轴触发有效
					type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function (params: any) {
					var tar1 = params[0];
					var tar2 = params[1];
					return (
						tar1.name +
						'<br/>' +
						tar1.seriesName +
						' : ' +
						tar1.value +
						'<br/>' +
						tar2.seriesName +
						' : ' +
						tar2.value
					);
				},
			},
		},
		[num, price]
	);

	const { run, loading } = useRequest<
		any,
		{
			startTime: String;
			endTime: String;
		}
	>('/admin/chart/findContract', {
		onSuccess: ({ data }) => {
			const xAxis = [];
			const num = [];
			const price = [];
			for (const item of data) {
				// eg. item = {date: '2020-12',price: '1300', num: 2}
				xAxis.push(item.date);
				num.push(item.num);
				price.push(item.price);
			}
			setXAxis(xAxis);
			setNum(num);
			setPrice(price);
		},
	});

	// 第一次加载数据
	useEffect(() => {
		const year = moment(new Date()).format('YYYY');
		run({
			startTime: `${year}-01`,
			endTime: `${year}-12`,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 处理日期的改变
	const handleChange = (startTime: string, endTime: string) => {
		run({
			startTime,
			endTime,
		});
	};
	return (
		<CommonCard
			title='合同详情'
			handleChange={handleChange}
			loading={loading}>
			<div
				ref={chartDom}
				style={{
					width: '100%',
					height: '100%',
				}}></div>
		</CommonCard>
	);
};

export default Contract;
