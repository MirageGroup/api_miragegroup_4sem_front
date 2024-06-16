import React from 'react';
import Slider from 'react-slick';
import MeetingCardDash from '../Cards/MeetingCardDash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CustomArrow from './CustomArrow';

export default function MeetingCarousel({ meetings }) {
  const settings = {
    dots: true,
    infinite: meetings.length > 1,
    speed: 500,
    slidesToShow: Math.min(meetings.length, 3),
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(meetings.length, 3),
          slidesToScroll: 1,
          infinite: meetings.length > 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(meetings.length, 2),
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {meetings.map((meeting) => (
          <div key={meeting.id} className="carousel-item p-[6px]">
            <MeetingCardDash
              m={meeting}
              showDelete={false}
              showJoin={true}
              showAta={false}
              showDownloadAta={false}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
