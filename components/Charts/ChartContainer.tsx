import classNames from 'classnames';


type Props = {
  children: React.ReactNode,
  width?: string,
  height?: number,
  className?: string,
  isBorder?: boolean,
}

const ChartContainer = ({
  isBorder = true,
  className,
  children,
}: Props) => {
  return (
    <div className={
      classNames(
        'p-2 lg:p-5 rounded-3xl',
        {'border-2 border-gray-200': isBorder},
        className
      )
    }>
      {children}
    </div>
  )
}

export default ChartContainer;