import hangingGarden from '../images/hangingGarden.webp';
import amongstFlowers from '../images/amongstFlowers.webp';
import trellis from '../images/trellis.webp';
import vegetableGarden from '../images/vegetableGarden.webp';
// Example data for the accordion


function initTips(){
    if (localStorage.getItem("tips") !== null) return;

    const gardeningTips = [
  //SOURCE:https://www.homesandgardens.com/ideas/small-vegetable-garden-ideas
  {
    title: "Make The Most Of Vertical Height With Hanging Baskets",
    content: "The best plants for hanging baskets aren't just trailing blooms, in fact hanging baskets can also be used to grow a wide range of vegetables, helping to increase the productivity of your small vegetable garden ideas. Taking up no ground space, they provide a versatile growing platform for a wide range of vegetables, working particularly well with cut and come again lettuce, rocket, and spinach as well as being able to be used for growing tomatoes or as herb planter ideas. Since the vegetables are elevated above the ground they are inaccessible to slugs, snails, rabbits and other animals who may decimate your crops when grown at ground level – protecting them from this helps to boost your yields.",
    image: hangingGarden,
  },
  {
    title: "Use Trellis For Compact Small Vegetable Garden Ideas",
    content: "A super-smart small vegetable garden idea is to try vegetable garden trellis ideas, to make the most of the space by using vertical surfaces to grow crops up – this is particularly useful if you are looking for ways to incorporate vegetable plants into courtyard garden ideas.Add in some herbs, which make excellent potted plants and can also be beneficial for companion planting, and you could have all you need to rustle up a delicious homegrown meal at your fingertips.",
    image:trellis
  },
  {
    title: "Build A Raised Bed Vegetable Garden",
    content: "Raised garden bed ideas are a popular way to grow edibles as part of small vegetable garden ideas.Wood, brick or sleepers can be used to frame your bed, and there are plenty of kits on the market – or you can follow Monty Don's raised bed tips. Fill your beds with good-quality soil, and then add your fruit or vegetable crops.You may like to plant in neat rows or decorative patterns for a mini potager effect, mixing in some companion planting. Rotating the crops ensures pests and diseases don’t build up, and also makes the nutrients added by one plant available to the subsequent plants. ",
    image:vegetableGarden
  },
  {
    title: "Plant A Small Vegetable Garden Amongst Flowers",
    content: "Small vegetable garden ideas require a bit of creative thinking. Mix edibles among your flowerbeds to emulate the traditional potager cottage garden ideas of the past, where flowers, vegetables, herbs and fruit were planted wherever they fitted. The vegetable or fruit plants can blend attractively beside other plants. Decorative choices to tuck in for small vegetable garden ideas include frilly lettuces and cabbages, architectural cardoons, runner beans and peas scrambling up tepees, rainbow chard and feathery asparagus and fennel.  ",
    image:amongstFlowers
  },
];
localStorage.setItem("tips", JSON.stringify(gardeningTips));
}
function getTips() {
    const products = localStorage.getItem("tips");
  
    return JSON.parse(products);
  }
export {initTips,getTips};