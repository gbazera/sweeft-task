import React from 'react';
import Masonry from 'react-masonry-css';

import { getPhoto } from '../api/unsplash';

interface PhotoGridProps {
    photos: any[];
}

interface Photo {
    id: string;
    urls: { regular: string };
    alt_description: string;
    views: { total: number };
    likes: { total: number };
    downloads: { total: number };
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
    const getStats = async (id: string) => {
        const data = await getPhoto(id);
        return data;
    }

    const openModal = async(photo: Photo) => {
        const modal = document.querySelector('.modal') as HTMLElement;
        const img = modal.querySelector('img') as HTMLImageElement;
        const views = modal.querySelector('#views') as HTMLElement;
        const likes = modal.querySelector('#likes') as HTMLElement;
        const downloads = modal.querySelector('#downloads') as HTMLElement;
        const stats = await getStats(photo.id);

        img.src = photo.urls.regular;
        img.alt = photo.alt_description;

        views.textContent = stats.views.toString();
        likes.textContent = stats.likes.toString();
        downloads.textContent = stats.downloads.toString();

        modal.classList.add('open');
        document.body.classList.add('overflow');
    }

    const closeModal = () => {
        const modal = document.querySelector('.modal') as HTMLElement;
        modal.classList.remove('open');
        document.body.classList.remove('overflow');
    }

    return (
        <>
            <Masonry breakpointCols={{ default: 3, 1100: 2, 700: 1 }} className={photos.length !== 0 ? "photo-grid" : 'photo-grid hidden'} columnClassName="grid-column">
                {photos.map((photo) => (
                    <div key={photo.id}>
                        <img src={photo.urls.small} alt={photo.alt_description} onClick={()=>{openModal(photo)}}/>
                    </div>
                ))}
            </Masonry>
            <div className="modal">
                <div className="bg" onClick={closeModal}></div>
                <button className="close" onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
                <div className="content">
                    <img src="" alt="" />
                    <div className="info">
                        <p><span className="material-symbols-outlined">thumb_up</span><span id='likes'></span></p>
                        <p><span className="material-symbols-outlined">visibility</span><span id='views'></span></p>
                        <p><span className="material-symbols-outlined">download</span><span id='downloads'></span></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PhotoGrid;