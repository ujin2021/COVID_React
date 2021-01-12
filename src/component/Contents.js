import { useState, useEffect } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import axios from 'axios'

const Contents = () => {
    const [confirmedData, setConfirmedData] = useState({}) // 초기값:{}(빈 객체)
    const [quarantinedData, setQuarantinedData] = useState({}) // 격리자 
    const [comparedData, setComparedData] = useState({}) // 격리자 

    useEffect(() => { // mount되었을 때 자동으로 실행되는
        const fetchEvent = async () => {
            const res = await axios.get('https://api.covid19api.com/total/dayone/country/kr')
            makeData(res.data)
        }
        const makeData = (items) => { // 각 월별 데이터(해당 월의 마지막날 데이터만 필요)
            const arr = items.reduce((acc, cur) => { // acc: 계속 쌓이는 것, cur: 현재 값
                const curDate = new Date(cur.Date)
                const year = curDate.getFullYear()
                const month = curDate.getMonth() // 월이 0부터 시작
                const date = curDate.getDate()
                const confirmed = cur.Confirmed // 누적확진자
                const active = cur.Active // 확진자
                const death = cur.Deaths // 사망
                const recovered = cur.Recovered // 회복
                
                const findItem = acc.find(a => a.year === year && a.month === month) // 해당 year, month의 data가 있는지 확인
                if(!findItem) { // find된 값이 없으면 아직 해당 년,월의 데이터가 push 되지 않았다는 뜻
                    // key와 value가 같으면 key:value대신 value만 적어도 된다
                    acc.push({year, month, date, confirmed, active, death, recovered}) 
                }
                if(findItem && findItem.date < date) { // 해당 month의 데이터가 있고, 현재의 date가 더 크다면 data update
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

            const labels = arr.map(a => `${a.month+1}월`)
            setConfirmedData({ // reuuce로 가공한 arr를 통해 ConfirmedData update
                labels,
                datasets: [
                    { 
                        label: '국내 누적 확진자',
                        backgroundColor: 'salmon',
                        fill: true,
                        data: arr.map(a => a.confirmed)
                    }
                    
                ]
            })
            setQuarantinedData({ // reuuce로 가공한 arr를 통해 ConfirmedData update
                labels,
                datasets: [
                    { 
                        label: '월별 격리자 현황',
                        borderColor: 'salmon',
                        fill: false,
                        data: arr.map(a => a.active)
                    }
                    
                ]
            })
            const last = arr[arr.length - 1] // 마지막 데이터를 보여줘야 하므로
            console.log(last)
            setComparedData({ // reuuce로 가공한 arr를 통해 ConfirmedData update
                labels: ['확진자', '격리해제', '사망'],
                datasets: [
                    { 
                        label: '누적확진, 해제, 사망 비율',
                        backgroundColor: ['#ff3d67', '#059bff', '#ffc233'],
                        fill: false,
                        data: [last.confirmed, last.recovered, last.death]
                    }
                    
                ]
            })
        }
        fetchEvent()
    })
    return (
        <section>국내 코로나 현황
            <div className='contents'>
                <div>
                    <Bar // react-chart의 태그
                        data={confirmedData} 
                        options={ // 차트 표현 옵션
                            { title: { display: true, text: '누적 확진자 추이', fontSize: 16}},
                            { legend: { display: true, position: 'bottom' }}
                        }
                    />
                </div>
                <div>
                    <Line // react-chart의 태그
                        data={quarantinedData} 
                        options={ // 차트 표현 옵션
                            { title: { display: true, text: '월별 격리자 현황', fontSize: 16}},
                            { legend: { display: true, position: 'bottom' }}
                        }
                    />
                </div>
                <div>
                    <Doughnut // react-chart의 태그
                        data={comparedData} 
                        options={ // 차트 표현 옵션
                            { title: { display: true, text: `누적확진, 해제, 사망 (${new Date().getMonth() + 1}`, fontSize: 16}},
                            { legend: { display: true, position: 'bottom' }}
                        }
                    />
                </div>
            </div>
        </section>
    )
}

export default Contents
