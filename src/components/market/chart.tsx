
import { AreaSeries, createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';



type CandleData = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}


interface Props {
    data?: CandleData[];

}


const candleData: CandleData[] = [
  { open: 10, high: 10.63, low: 9.49, close: 9.55, time: '2018-12-12' },
  { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: '2018-12-13' },
  { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: '2018-12-14' },
  { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: '2018-12-15' },
  { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: '2018-12-16' },
  { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: '2018-12-17' },
  { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: '2018-12-18' },
  { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: '2018-12-19' },
  { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: '2018-12-20' },
  { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: '2018-12-21' },
  { open: 10.96, high: 11.90, low: 10.80, close: 11.50, time: '2018-12-22' },
  { open: 11.50, high: 12.00, low: 11.30, close: 11.80, time: '2018-12-23' },
  { open: 11.80, high: 12.20, low: 11.70, close: 12.00, time: '2018-12-24' },
  { open: 12.00, high: 12.50, low: 11.90, close: 12.30, time: '2018-12-25' },
  { open: 12.30, high: 12.80, low: 12.10, close: 12.60, time: '2018-12-26' },
  { open: 12.60, high: 13.00, low: 12.50, close: 12.90, time: '2018-12-27' },
  { open: 12.90, high: 13.50, low: 12.70, close: 13.20, time: '2018-12-28' },
  { open: 13.20, high: 13.70, low: 13.00, close: 13.50, time: '2018-12-29' },
  { open: 13.50, high: 14.00, low: 13.30, close: 13.80, time: '2018-12-30' },
  { open: 13.80, high: 14.20, low: 13.60, close: 14.00, time: '2018-12-31' },
];

export const ChartComponent = ({data = candleData }: Props) => {

    const chartContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
            if (!chartContainerRef.current) return;

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "black" },
                    textColor: "gray",
                },
                width: chartContainerRef.current.clientWidth,
                height: 400,
                grid: {
                  vertLines: {color: "#111"},
                  horzLines: {color: "#111"}
                }
            });
            
            
            chart.timeScale().fitContent();

            const newSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350', borderUpColor: "red" });

            newSeries.setData(data);

            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
            };
        }, [data])

    return (
        <div
            ref={chartContainerRef}
            className=''
        />
    );
};
