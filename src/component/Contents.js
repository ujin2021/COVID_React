import { useState, useEffect } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import axios from 'axios'

const Contents = () => {
    const [confirmedData, setConfirmedData] = useState({ // 초기 설정
        labels: ['1월', '2월', '3월'],
        datasets: [
            { 
                label: '국내 누적 확진자',
                backgroundColor: 'salmon',
                fill: true,
                data: [10, 5, 3]
            }
            
        ]
    })

    useEffect(() => { // mount되었을 때 자동으로 실행되는
        const fetchEvent = async () => {
            const res = await axios.get('https://api.covid19api.com/total/dayone/country/kr')
            makeData(res.data)
        }
        const makeData = (items) => {
            const arr = items.reduce((acc, cur) => { // 각 월별 데이터(해당 월의 마지막날 데이터만 필요)
                const curDate = new Date(cur.Date)
                const year = curDate.getFullYear()
                const month = curDate.getMonth()
                const date = curDate.getDate()
                const confirmed = cur.Confirmed
                const active = cur.Active
                const death = cur.Death
                const recovered = cur.Recoverd
                
                const findItem = acc.find(a => a.year === year && a.month === month)
                if(!findItem) {
                    acc.push({year, month, date, confirmed, active, death, recovered})
                }
                if(findItem && findItem.date < date) { // data update
                    findItem.active = active
                    findItem.death = death
                    findItem.date = date
                    findItem.month = month
                    findItem.year = year
                    findItem.recovered = recovered
                    findItem.confirmed = confirmed
                }
                return acc
            }, [])
            console.log(arr)
        }
        fetchEvent()
    })
    return (
        <section>국내 코로나 현황
            <div className='contents'>
                <div>
                    <Bar 
                        data={confirmedData} 
                        options={ // 차트 표현 옵션
                            { title: { display: true, text: '누적 확진자 추이', fontSize: 16}},
                            { legend: { display: true, position: 'bottom' }}
                        }
                    />
                </div>
            </div>
        </section>
    )
}

export default Contents
