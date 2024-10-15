// components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <div className="bg-[url('https://s3-alpha-sig.figma.com/img/2d12/f49d/69c185423bd46e4478a5ae7711c29fa5?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QKxN8qEhG1Nho1XjpwYJU2wvC3X8fB47Q9Sar6pJDPTSY~2E35q6HXd266ujYCPbj5w2XP-nYpkXfXqgWxIs2dhjhC0AJ~~9LBhz0bCXugc0QzJd3QjODh6LozqYzoaS1jwcGWgqQDDOLqgfbtzQNx4p8jc1SjJuA~QTSeESPP6FxD~58ptlNwG4DJKuaxo7i3T1g2ukkjhOW4SSuamiiEfE65OYwI917HhuBTtU-wm~dVGmFhkpC8CTGtoFAnUtVFV6fL1QDougHJBrZCqJeD5r-hMnzUYLNfkLfGYZBu2hjvNz1HOqXK5YTVB2mSvnjOJifkS~XoybBVfky~4Ltg__')] bg-cover bg-center text-center py-20 text-white">
      <h1 className="text-5xl mb-8">DISCOVER THE</h1>
      <h1 className="text-6xl font-bold mb-8">EXTRAORDINARY</h1>
      <input 
        type="text" 
        placeholder="What are you looking for?" 
        className="w-1/2 p-4 rounded-full text-black placeholder-gray-500"
      />
    </div>
  );
};

export default Hero;