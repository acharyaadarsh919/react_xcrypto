import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '..';
import { Button, Container, HStack, Radio, RadioGroup, Text} from '@chakra-ui/react';
import Loader from './Loader';
import Error from './Error';
import CoinCard from './CoinCard';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState('inr');

  const currencySymbol = currency === 'inr' ? '₹' : currency === 'eur' ? '€' : '$';

  const totalPages = 103;
  // const btns = new Array(132).fill(1);

  useEffect(()=>{
    const fetchCoins = async ()=>{
      try{
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoins();
  },[ currency, page]);

  const changePage = (pageNo) => {
    setPage(pageNo);
    setLoading(true)
  }

  const prevPage = () => {
    if(page===1) { 
      return
    } else { setPage(page - 1);}
  }

  const nextPage = () => {
    if(page===totalPages) { 
      return
    } else { setPage(page + 1);}
  }


  return (
    <Container
    maxW={'container.xl'}
    >
      { 
        error ? <Error message={'Error while fetching Coins'} /> : 
            loading ? <Loader /> : 
              <>
                <RadioGroup value={currency} onChange={setCurrency} p='8'>
                  <HStack justifyContent={'center'} spacing={'6'}>
                    <Radio value='inr'>INR (₹) </Radio>
                    <Radio value='eur'>EUR (€)</Radio>
                    <Radio value='usd'>USD ($)</Radio>
                  </HStack>
                </RadioGroup>

                <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
                  {
                    coins.map((i)=>(
                      <CoinCard 
                      key={i.id} 
                      id={i.id} 
                      name={i.name} 
                      image={i.image} 
                      symbol={i.symbol} 
                      price={i.current_price} 
                      currencySymbol={currencySymbol} 
                      />
                    ))
                  }
                </HStack>

                {/* <HStack w={'full'} overflowX={'auto'} p='8'>
                  {btns.map((item, index)=>(
                    <Button key={index} bgColor={'blackAlpha.900'} color={'white'} onClick={() => changePage(index + 1)}>
                      {index + 1}
                    </Button>
                  ))}
                  </HStack> */}

                  <HStack justifyContent={'center'} m='5'>
                    <Button bgColor={'green.600'} color={'white'} onClick={()=> setPage(1)}>Start</Button>
                    <Button bgColor={'green.600'} color={'white'} onClick={()=> prevPage()}>Prev</Button>
                    <Text>{`${page} of ${totalPages}`}</Text>
                    <Button bgColor={'green.600'} color={'white'} onClick={()=> nextPage()}>next</Button>
                    <Button bgColor={'green.600'} color={'white'} onClick={()=> setPage(totalPages)}>End</Button>
                  </HStack>
              </>
      }
    </Container>
  )
}

export default Coins