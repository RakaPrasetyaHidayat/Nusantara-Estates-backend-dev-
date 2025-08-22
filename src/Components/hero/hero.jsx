import './hero.css';

const Hero = () => {
    const scrollToSection = (sectionId) => {
        try {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn(`Element with id '${sectionId}' not found`);
            }
        } catch (error) {
            console.error('Scroll error in Hero:', error);
        }
    };

    return (
        <div className='hero-container'>
            <div className='hero-content'>
                <div className='title-container'>
                    <h1 className='cursor typewriter-animation'>Membantu Menemukan <br />Rumah Yang Anda Inginkan</h1>
                    <p>Rumah singgah hadir untuk membantu anda merekomendasikan rumah yang aman dan lingkungan yang nyaman</p>
                    <div className="button-group">
                        <button 
                            className='explore-button'
                            onClick={() => scrollToSection('cari-rumah-section')}
                        >
                            Temukan Rumah
                        </button>
                    </div>
                </div>
            
                <div className="hero-image">
                    <img src="/img/hero.png" alt="" />
                </div>
            </div>
        </div>
    );
}

export default Hero;
