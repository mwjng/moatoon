import React, { useEffect, useState } from "react";

const BookDetail = ({ story }) => {
    const [coverImage, setCoverImage] = useState("");

    useEffect(() => {
        fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `이 동화에 맞는 표지를 생성해줘: ${story}`,
                n: 1
            })
        })
        .then(response => response.json())
        .then(data => setCoverImage(data.data[0].url));
    }, [story]);

    return (
        <div>
            <img src={coverImage} alt="동화 표지" />
            <p>{story}</p>
        </div>
    );
};

export default BookDetail;
