import React from 'react';
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { Pie } from "@visx/shape";
import Ordinal from '@visx/legend/lib/legends/Ordinal';
import { ScaleSVG } from '@visx/responsive';

interface DataInterface {
  usage: string;
  amount: number;
  color: string;
}

interface PieChartProps {
  width: number;
  height: number;
  events?: boolean;
  data: DataInterface[];
  margin?: { top: number; right: number; bottom: number; left: number };
};

export class PieChart extends React.Component<PieChartProps>{

  render() {
    let width = this.props.width;;
    let height = this.props.height;
    let data = this.props.data;
    const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };
    const innerWidth = width - defaultMargin.left - defaultMargin.right;
    const innerHeight = height - defaultMargin.top - defaultMargin.bottom;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const top = centerY + defaultMargin.top;
    const left = centerX + defaultMargin.left;
    const donutThickness = 70;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const getAmounts = (d: DataInterface) => d.amount;

    const getColors = scaleOrdinal({
      domain: data.map((l) => l.usage),
      range: data.map((l) => l.color)
    });

    return (
      <>
        <ScaleSVG width={width} height={height}>
          <Group top={top} left={left} width={width} height={height}>
            <Pie
              data={data}
              pieValue={getAmounts}
              outerRadius={radius}
              padAngle={0.05}
              innerRadius={radius - donutThickness}
              width={width}
              height={height}
            >
              {(pie) => {
                return pie.arcs.map((arc, index) => {
                  const { usage } = arc.data;
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
                  let arcPath = pie.path(arc) || '';
                  const arcFill = getColors(usage);

                  return (
                    <g key={`arc-${usage}-${index}`}>
                      <path d={arcPath} fill={arcFill} />
                      {hasSpaceForLabel && (
                        <text
                          x={centroidX}
                          y={centroidY}
                          dy=".11em"
                          fill="#454545"
                          fontSize={16}
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {arc.data.amount} €
                        </text>
                      )}
                    </g>
                  );
                });
              }}
            </Pie>
          </Group>
        </ScaleSVG>
        <div className="scale">
          <Ordinal
            scale={getColors}
            labelMargin="0 20px 0 10px"
            shapeMargin="0"
          />
        </div>
      </>
    );

  }

}
