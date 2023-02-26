import './App.css';
import {
    Button,
    Box,
    Flex,
    Text,
    Image,
    useColorModeValue,
    ChakraProvider, useToast, TabPanel, TabPanels, Tab, TabList, Tabs, Center
} from '@chakra-ui/react';
import {useState} from "react";
import {PieChart} from "react-minimal-pie-chart";
import { sha256} from 'js-sha256';

const candidates = [
    {
        id: 1,
        name: "John Doe",
        image: "https://i.pravatar.cc/300?img=6",
        party: "Independent",
        description: "John Doe is a business owner with 10 years of experience in the industry.",
    },
    {
        id: 2,
        name: "Jane Smith",
        image: "https://i.pravatar.cc/300?img=2",
        party: "Democratic Party",
        description: "Jane Smith is a lawyer with a focus on environmental law and policy.",
    },
    {
        id: 3,
        name: "Mike Johnson",
        image: "https://i.pravatar.cc/300?img=3",
        party: "Republican Party",
        description: "Mike Johnson is a former military general who is running on a platform of national security and defense.",
    },
];

function App() {
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const bg = useColorModeValue('gray.50', 'gray.700')
    const toast = useToast();

    const handleVote = async (candidate) => {
        setSelectedCandidate(candidate)
        setIsDisabled(true)
        const ip = await fetch("https://api.ipify.org?format=json");
        ip.json().then(r => {
            sendVote(r.ip, candidate.id).then(r => console.log(r));
        });
        if (!isDisabled) toast({
            title: "Voted!",
            description: `You voted for ${candidate.name}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }

    const sendVote = async (ip, id) => {
        console.log("ip: " + ip);
        const res = await fetch('http://localhost:5000/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sha256(ip.toString()).toString(),
                vote: id
            })
        })
        const data = await res.json()
        console.log(data)
    }

    return (
        <ChakraProvider>
            <Flex
                direction="column"
                align="center"
                bg={bg}
                minH="100vh"
                justifyContent="center"
                px={4}
                className={"h-screen space-y-10 bg-slate-700"}
            >
                <Tabs className={"w-3/4 h-4/5 shadow-2xl rounded-lg bg-white"} isFitted>
                    <TabList>
                        <Tab>Vote</Tab>
                        <Tab>Results</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Text fontSize="3xl" fontWeight="bold" mb={8} color="gray.700">
                                Vote for your favorite candidate:
                            </Text>
                            <div className={"flex space-x-10"}>
                                {candidates.map((candidate) => (
                                    <Box
                                        key={candidate.id}
                                        w={['100%', '50%', '33.3%']}
                                        p={0}
                                        onClick={() => handleVote(candidate)}
                                        sx={isDisabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                                        opacity={isDisabled && selectedCandidate.id !== candidate.id ? 0.5 : 1}
                                        pointerEvents={
                                            isDisabled && selectedCandidate.id !== candidate.id ? 'none' : 'auto'
                                        }
                                        bg="white"
                                        borderRadius="lg"
                                        boxShadow="md"
                                        transition="transform 0.2s"
                                        _hover={!isDisabled && { transform: 'scale(1.05)' }}
                                        className={"h-1/6"}
                                    >
                                        <Image
                                            src={candidate.image}
                                            alt={candidate.name}
                                            objectFit="cover"
                                            className={"rounded-t-lg"}
                                        />
                                        <Box p={4}>
                                            <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                                                {candidate.name}
                                            </Text>
                                            <Button
                                                variant="solid"
                                                colorScheme="blue"
                                                mt={4}
                                                isDisabled={isDisabled && selectedCandidate.id !== candidate.id}
                                            >
                                                {isDisabled && selectedCandidate.id === candidate.id ? 'Voted!' : 'Vote'}
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <Center className={"w-full"}>
                                <PieChart
                                    data={[
                                        { title: 'One', value: 10, color: '#E38627' },
                                        { title: 'Two', value: 15, color: '#C13C37' },
                                        { title: 'Three', value: 20, color: '#6A2135' },
                                    ]}
                                    className={"w-1/2 h-1/2 mx-10"}
                                />
                                <Button>Download blockchain</Button>
                            </Center>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </ChakraProvider>
  );
}

export default App;
