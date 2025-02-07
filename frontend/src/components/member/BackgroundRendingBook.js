import React from 'react';
import book1 from '../../assets/images/book1.png';
import book2 from '../../assets/images/book2.png';
import book3 from '../../assets/images/book3.png';
import book4 from '../../assets/images/book4.png';
import book5 from '../../assets/images/book5.png';
import book6 from '../../assets/images/book6.png';
import book7 from '../../assets/images/book7.png';

const bookImages = [book1, book2, book3, book4, book5, book6, book7];

export default function BackgroundRendingBook() {
    return (
        <div
            className="relative w-full bg-yellow-50 overflow-hidden "
            style={{ transform: 'rotate(-25deg)', height: '400px', backgroundColor: '#FEFBEB' }}
        >
            {/* 첫 번째 줄 (왼쪽 → 오른쪽) */}
            <div className="absolute top-0 w-full flex gap-4  w-[200%] left-20">
                {[...bookImages, ...bookImages].map((src, index) => (
                    <img key={index} src={src} className="w-40 h-48 object-cover shrink-0" alt="book" />
                ))}
            </div>

            {/* 두 번째 줄 (오른쪽 → 왼쪽) */}
            <div className="absolute bottom-0 w-full flex gap-4  w-[200%] right-[50%]">
                {[...bookImages, ...bookImages].map((src, index) => (
                    <img key={index} src={src} className="w-40 h-48 object-cover shrink-0" alt="book" />
                ))}
            </div>
        </div>
    );
}
