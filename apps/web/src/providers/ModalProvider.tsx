import { ReactNode,createContext, useContext,useState } from "react";
import { Modal } from "react-bootstrap";

interface ModalContext{
    setModalContent:(content:ReactNode)=>void;
    openModal:()=>void;
    closeModal:()=>void;
}


const ModalContext = createContext<ModalContext | undefined>(undefined)

export const useModal = ()=>{
    const context = useContext(ModalContext);
    if(!context) throw new Error("useModal must be used withing ModalProvider")
    return context;
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [modalContent,setModalContentState] = useState<ReactNode>(<></>)

    const setModalContent = (content:ReactNode) =>setModalContentState(content);
    const openModal = ()=> setOpen(true);
    const closeModal = ()=>setOpen(false);

    return(
        <ModalContext.Provider value={{setModalContent,openModal,closeModal}}>
            {children}
            <Modal show={isOpen}
                    onHide={()=>closeModal()}
                    size="lg"
                    fullscreen='md-down'
                    centered>
                        {modalContent}
            </Modal>
        </ModalContext.Provider>
    )
}