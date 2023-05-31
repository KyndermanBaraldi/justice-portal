import styles from './footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_content}>
                <div className={styles.footer_content_items}>
                    <h3>Liga da Justiça</h3>
                    <p>Feito para super escreventes</p>
                </div>
                <div className={styles.footer_content_items}>
                    <h3>Desenvolvido por</h3>
                    <p> <a href="https://github.com/KyndermanBaraldi" target='_blank' rel="noreferrer noopener">@Kynderman Baraldi</a></p>
                </div>
                <div className={styles.footer_content_items}>
                    <h3>Contato</h3>
                    <p>
                        <a href="mailto: kynderman@gmail.com">
                            kynderman@gmail.com
                        </a>
                    </p>
                </div>
            </div>
            
        </footer>
    );
};

export default Footer;