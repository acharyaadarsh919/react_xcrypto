import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import React, { useState , useEffect} from 'react';
import Loader from './Loader';
import Error from './Error';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { server } from '..';
import Chart from './Chart';


const CoinDetails = () => {
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('inr');
  const [days, setDays] = useState('24h');
  const [chartArray, setChartArray] = useState([]);

  const {id} = useParams();
  const currencySymbol = currency === 'inr' ? '₹' : currency === 'eur' ? '€' : '$';
  const btns = ['24h','7d', '14d', '30d', '60d', '200d', '365d', 'max']

  useEffect(()=>{
    const fetchCoin = async ()=>{
      try{
        const { data } = await axios.get(`${server}/coins/${id}`);
        const { data:chartData } = await axios.get(`${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`);
        setCoin(data);
        setChartArray(chartData.prices)
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  },[ id, currency, days ]);

  const switchChart = (day) => {
    if(days === day) return ;
    setDays(day);
    setLoading(true)
  }

  return (
    <Container
    maxW={'container.xl'}
    >
      {
        error ? <Error message={'Error while fetching Coin'} /> : 
          loading ? <Loader /> : 
            <>
              <Box
              w={'full'}
              borderWidth={1}
              >
              <Chart arr={chartArray} currency={currencySymbol} days={days} />
              </Box>

              <HStack p='4' wrap={'wrap'}>
                {btns.map((i)=> (
                  <Button 
                  m='2'
                  key={i} 
                  bgColor={days === i ? 'green' : null} 
                  color={days === i ? 'white' : null} 
                  onClick={()=> switchChart(i)} >{i}</Button>
                ))}
              </HStack>

              <RadioGroup value={currency} onChange={setCurrency} p='8'>
                  <HStack justifyContent={'center'} spacing={'6'}>
                    <Radio value='inr'>INR (₹) </Radio>
                    <Radio value='eur'>EUR (€)</Radio>
                    <Radio value='usd'>USD ($)</Radio>
                  </HStack>
              </RadioGroup>

              <VStack 
              spacing={'4'}
              p='16'
              pt={'1'}
              alignItems={'flex-start'}
              >
                <Text
                fontSize={'small'}
                alignSelf={'center'}
                opacity={'0.7'}
                >
                  Last Updated on {coin.last_updated.split('T')[0]} at {coin.last_updated.split('T')[1].split('.')[0]}
                </Text>

                <Image src={coin.image.large} w='16' h='16' objectFit={'contain'} />
                
                <Stat>
                  <StatLabel>{coin.name}</StatLabel>
                  <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={coin.market_data.price_change_percentage_24h >= 0 ? 'increase' : 'decrease'} />
                    {coin.market_data.price_change_percentage_24h}%
                  </StatHelpText>
                </Stat>
                
                <Badge
                fontSize={'2xl'}
                bgColor={'blackAlpha.800'}
                color={'white'}
                >
                  {`#${coin.market_cap_rank}`}
                </Badge>
                
                <CustomBar low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} high={`${currencySymbol}${coin.market_data.high_24h[currency]}`} />
                
                <Box w='full' p='4'>
                  <Item title={'Max Supply'} value={coin.market_data.total_supply} />
                  <Item title={'Circulating Supply'} value={coin.market_data.circulating_supply} />
                    <Item title={'Market Cap'} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
                    <Item title={'All Time Low'} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
                    <Item title={'All Time High'} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
                </Box>
              </VStack>
            </>
      }
    </Container>
  )
}

const CustomBar = ({low , high}) => (
  <VStack w='full'>
    <Progress value={50} colorScheme={'teal'} w='full' />
    <HStack w='full' justifyContent={'space-between'}>
      <Badge children={low} colorScheme='red' />
      <Text fontSize={'sm'}>24H Range</Text>
      <Badge children={high} colorScheme='green' />
    </HStack>
  </VStack>
)

const Item = ({title, value}) => (
  <HStack w='full' justifyContent={'space-between'} my={'4'}>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>{title}</Text>
    <Text>{value}</Text>
  </HStack>
)


export default CoinDetails

// bebas Neue font family link in index.html