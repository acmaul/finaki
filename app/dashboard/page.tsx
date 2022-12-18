import ArrowCircleIcon from '@/icons/ArrowCircleIcon';
import classNames from 'classnames';
import React from 'react'
import AreaChart from '../../components/Charts/AreaChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';

type Props = {}
export const data = [
  {name: '1 Des', in: 100, out: 350, total: 2400},
  {name: '2 Des', in: 200, out: 500, total: 2420},
  {name: '3 Des', in: 100, out: 100, total: 2200},
  {name: '4 Des', in: 400, out: 350, total: 2350},
  {name: '5 Des', in: 250, out: 250, total: 2150},
  {name: '6 Des', in: 300, out: 350, total: 2200},
  {name: '7 Des', in: 300, out: 400, total: 2600},
];

const transactions = [
  {name: 'Beli Baju', category: 'Cloth', type: 'out', value: 3000, date: '2 Desember', hour: '18:64'},
  {name: 'Beli Baju', category: 'Cloth', type: 'in', value: 3000, date: '2 Desember', hour: '18:64'},
  {name: 'Beli Baju', category: 'Cloth', type: 'in', value: 3000, date: '2 Desember', hour: '18:64'},
  {name: 'Beli Baju', category: 'Cloth', type: 'out', value: 3000, date: '2 Desember', hour: '18:64'},
]

const dataCategories = [
  {name: 'Food', value: 400},
  {name: 'Transport', value: 300},
  {name: 'Clothes', value: 300},
  {name: 'Entertainment', value: 200},
  {name: 'Others', value: 278},
]

const Page = (props: Props) => {


  return (
    <div className='flex flex-col gap-4'>
      <AreaChart data={data}/>
      <div className='flex flex-col lg:flex-row gap-4 justify-between'>
        <BarChart data={data}/>
        <PieChart data={dataCategories}/>
      </div>
      {/* TODO: Create recent transactions component and then refator it */}
      <div className='flex gap-4 h-fit'>
        <div className='flex-1 p-7 bg-slate-50 rounded-xl'>
          <h1 className='font-bold text-xl mb-6'>Transkasi terbaru</h1>
          {/* <div className="flex w-full py-3 border-b">
            <span className='font-bold flex-1'>Nama</span>
            <span className='font-bold w-4/12'>Kategori</span>
            <span className='font-bold'>Nominal</span>
          </div> */}
          {
            transactions.map((transaction, index) => (
              <div key={index} className="flex w-full py-3 border-b items-center">
                <span>
                  <div className='mr-10'>
                    <ArrowCircleIcon
                      direction={
                        transaction.type === 'in' ? 'up' : 'down'
                      }
                      className={classNames(
                        {'text-green-500': transaction.type === 'in'},
                        {'text-red-500': transaction.type === 'out'},
                      )}
                    />
                  </div>
                </span>
                <span className='w-[40%] font-medium'>{transaction.name}</span>
                <span></span>
                <span className='flex flex-col w-[30%]'>
                  <span className='font-medium'>{transaction.date}</span>
                  <span>{transaction.hour}</span>
                </span>
                <span className={classNames(
                  'font-medium  ml-auto', 
                  {'text-green-500': transaction.type === 'in'}, 
                  {'text-red-500': transaction.type === 'out'}
                )}>{transaction.type === 'out' && '-'}Rp. {transaction.value}</span>
              </div>
            ))
          }
        </div>
        <div className='w-[27rem] h-full bg-slate-50'>
          <div>
            asd
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page