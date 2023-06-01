import { Avatar, Box, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <Box 
    bgColor={'blackAlpha.900'} 
    color={'whiteAlpha.700'}
    minH={'48'}
    px={'16'}
    py={['16', '8']}
    >
        <Stack
        direction={['column', 'row']}
        alignItems={'center'}
        h='full'
        >
            <VStack w='full' alignItems={['center', 'flex-start']}>
                <Text fontWeight={'bold'}> About Us</Text>
                <Text
                fontSize={'sm'}
                letterSpacing='widest'
                textAlign={['center', 'left']}
                >XCrypto, India's most valuable crypto investment app, is dedicated to make crypto accessible in a simple way. Established in 2018, XCrypto has solved numerous problems faced by the indian crypto community with solutions around crypto investing, crypto trading & crypto literacy.</Text>
            </VStack>
            <VStack>
                <Avatar boxSize={'28'} mt={['4', '0']} />
                <Text>Our Founder</Text>
            </VStack>
        </Stack>
    </Box>
  )
}

export default Footer