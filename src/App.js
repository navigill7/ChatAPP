import  { useRef , useState , useEffect} from "react"
//import Home from "./Home"
import {Box , Button, Container , HStack, Input, VStack} from "@chakra-ui/react"
import Message from "./Components/Message"
import { signOut , onAuthStateChanged, getAuth , GoogleAuthProvider , signInWithPopup} from "firebase/auth"
import { query , orderBy , onSnapshot,serverTimestamp, getFirestore , addDoc, collection} from "firebase/firestore"
import {app} from "./firebase"

const db = getFirestore(app)

const auth=getAuth(app)
const loginHandler = ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth , provider);
}
const logouthandler =()=>{
  signOut(auth);
}

function App() {
  
  const [user , setUser] = useState(false)
  const [message , setMessage] = useState(" ")
  const [messages ,setMessages ] = useState([])
  const divForScroll = useRef(null)
  //console.log(user)
  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db,"Messages") , {
        text:message,
        uid:user.uid,
        url:user.photoURL,
        createdAt:serverTimestamp()
      })
      
      divForScroll.current.scrollIntoView({behaviour: "smooth"});
    } catch (error) {
      alert(error)
    }
  }
  useEffect(()=>{
    const q = query(collection(db , "Messages") , orderBy("createdAt" , "asc"))
    const unsubscribe =  onAuthStateChanged(auth , (data)=>{
      setUser(data);
    });

    const unsubscriceformessages = onSnapshot(q ,(snap)=>{
      setMessages(snap.docs.map((item)=>{
        const id = item.id;
        //console.log(item.data())
        return {id , ...item.data() };
      })
      )
    })
    return ()=>{
      unsubscribe();
      unsubscriceformessages();
    }
  },[]);

  return (

    <Box bg={"red.100"}>
      {
        user?(
          <Container h={"100vh"} bg={"white"} > 
         <VStack h="full" paddingY={"4"}>
           <Button onClick={logouthandler} colorScheme="red" w={"full"} >Logout</Button>
           <VStack h={"full"} w={"full"}  overflowY="auto" css={{"&::-webkit-scrollbar":{
            display: "none"
           }}} >
            {
              messages.map(item=>(
                <Message key={item.id} user={item.uid===user.uid ? "me": "other"} text={item.text} uri={item.uri}/>
              ))
            }
            <div ref={divForScroll}></div>
           </VStack>
           
           <form onSubmit={submitHandler} style={{width: "100%"}}>
           <HStack>
            <Input value={message} onChange={(e)=>{
              setMessage(e.target.value)
            }} placeholder="Enter a Message..." />
            <Button  colorScheme="purple" type="submit">Send</Button>
            </HStack>
            </form>
         </VStack>

      </Container>
        ):<VStack bg={"white"} alignItems={"center"} justifyContent={"center"} h={"100vh"}>
             <Button onClick={loginHandler} colorScheme={"purple"}>Sign In with Google</Button>
        </VStack>
      }
    </Box>
  );
}

export default App;