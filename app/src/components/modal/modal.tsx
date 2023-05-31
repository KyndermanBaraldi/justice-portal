import styles from './modal.module.css';

type ModalProps = {
    isOpen: boolean,
    children: React.ReactNode,
    setIsOpen: (isOpen: boolean) => void,
    title?: string,
}

const Modal = ( {isOpen, children, setIsOpen, title}: ModalProps) => {
    
    if (isOpen) {
        return (
            <div className={styles.modal}>
                <div className={styles.modalcontent}>
                    <header className={styles.modalheader}>
                        <span className={styles.modaltitle}>{title}</span>
                        <button className={styles.modalclose} onClick={() => setIsOpen(false)}>X</button>
                    </header>
                    {children}
                </div> 
            </div>
        )

    }

    return null
}

export default Modal