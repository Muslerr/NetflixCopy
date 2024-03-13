import { useEffect, useState } from 'react';
import Title from '../../components/shared/title/Title.jsx';
import Loading from '../../components/shared/loading/Loading.jsx';
import MessageBox from '../../components/shared/messageBox/MessageBox.jsx';
import ListItem from '../../components/shared/listItem/ListItem.jsx';
import { useUser } from '../../contexts/UserContext.jsx';
import Navbar from '../../components/shared/Navbar/Navbar.jsx';
import { axios } from '../../imports';
import './SearchPage.scss';

const SearchPage = () => {
  const [currOrder, setCurrOrder] = useState('a-z');
  const [currGenre, setCurrGenre] = useState('All');
  const [currQuery, setCurrQuery] = useState('');

  const [orders, setOrders] = useState(['year', 'a-z', 'z-a']);
  const [genres, setGenres] = useState([]);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { get } = useUser();
  const userInfo = get();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const genresResponse = await axios.get('/api/v1/content/genres', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        genresResponse.data.unshift('All');
        setGenres(genresResponse.data);

        const contentResponse = await axios.get('/api/v1/content', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        setContent(contentResponse.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getFilteredContent = () => {
      try {
        setLoading(true);
  
        let filteredContent = content.slice(); // Create a shallow copy of content array
        
        // Filtering
        if (currQuery !== '') {
          filteredContent = filteredContent.filter((c) => c.title.toLowerCase().includes(currQuery.toLowerCase()));
        }
        if (currGenre !== 'All') {
          filteredContent = filteredContent.filter((c) => c.genre === currGenre);
        }
        
        // Sorting
        switch (currOrder) {
          case 'a-z':
            filteredContent.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'z-a':
            filteredContent.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case 'year':
            filteredContent.sort((a, b) => a.year.localeCompare(b.year));
            break;
          default:
            break;
        }
  
        setLoading(false);
        return filteredContent;
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
        return []; // Return empty array in case of error
      }
    };
  
    const updatedFilteredContent = getFilteredContent();
    setFilteredContent(updatedFilteredContent);
  }, [content, currQuery, currGenre, currOrder]);
  
  
  const handleSearchChange = (e) => {
    setCurrQuery(e.target.value);
   
  };

  const handleGenreChange = (e) => {
    setCurrGenre(e.target.value);
    
  };

  const handleOrderChange = (e) => {
    setCurrOrder(e.target.value);
    
  };

  

  return (
    <>
    <Navbar />
    <div className='search-page'>
      <Title title='Search Page' />
      
      <br />
      <br />
      <br />
      <div className='selectors-and-search'>
        <div className='selectors'>
          <div className='selector'>
            <select className='genre-selector' onChange={handleGenreChange}>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className='selector'>
            <select className='order-selector' onChange={handleOrderChange}>
            <option value="" disabled selected>Order by</option> 
              {orders.map((order, index) => (
                <option key={index} value={order}>
                  {order}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='search-input'>
          <input type='text' onChange={handleSearchChange} placeholder='Search...' />
        </div>
      </div>

      <div className='content-list'>
        {loading ? (
          <Loading />
        ) : error ? (
          <MessageBox variant='danger'>{error.MessageBox}</MessageBox>
        ) : (
          <>
            {filteredContent.length === 0 && <h1>No content Found.</h1>}
            {filteredContent.map((c) => (
              <div  key={c.title}>
                <ListItem content={c} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default SearchPage;