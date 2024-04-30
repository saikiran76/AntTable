import {Select, Input, Table, Tag } from "antd";
import { useEffect, useState } from "react";

const List = () =>{
  const [LoadingState, setLoadingState] = useState(true);
  const [DataSource, setDataSource] = useState([])

  const [filters, setFilters] = useState([]);

  const [search, setSearch] = useState("");

  // const filteredRows = DataSource.filter((row) => {
  //   return row.name.toLowerCase
  //   .includes(filter.toLowerCase()) || row.title.toLowerCase().includes(filter.toLowerCase());
  // });

  const filteredData = DataSource.filter(
    data =>{
      return filters.every(f=>data.tags.includes(f)) && data.body.toLowerCase().includes(search.toLowerCase())
    }
  )

  // console.log('the filtered data' + ' ' + JSON.stringify(filteredData))

  const tagOptions = [...new Set(DataSource.map(data=>data.tags))]
  // console.log('The tag options are' + tagOptions)

  const uniqueTags = new Set(tagOptions);


  function transformSetToArray(dataSet) {
    const uniqueElements = [];
  
    for (const elementList of dataSet) {
      uniqueElements.push(...elementList);
    }
    
    return [...new Set(uniqueElements)];
  }
  // console.log(transformSetToArray(uniqueTags))
  const newTags = transformSetToArray(uniqueTags);
  const tagsObj = [...newTags].map(tag => ({ value: tag, label: tag }));
  console.log(tagsObj);

  useEffect(()=>{
    dataFetch();
  }, [])

  const dataFetch = async() =>{
    try{
      const data = await fetch('https://dummyjson.com/posts');
      const jsonData = await data.json();
      console.log(jsonData)
      setDataSource(jsonData.posts)
      setLoadingState(false)
      }catch(error){
        console.log("Error fetching data")
      }
   }
      
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'name',
        render: (text) => <a>{text}</a>
  
      },
      {
        title: 'Content',
        dataIndex: 'body',
        key:'body'

      },
      {
        title: 'tags',
        showSorterTooltip: {
          target: 'full-header',
        },
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <div className="cursor-pointer" key={tag}>
                  <Tag className="cursor-pointer" color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                </div>
              );
            })}
          </>
        ),

      },

      {
        title: 'reactions',
        dataIndex: 'userId',
        key:'3'

      },
    ];

    return (
      <div className="mx-16 my-16">
        <Select
        className="w-[15em] mx-2 my-2"
        placeholder="history"
        defaultValue="history"
        mode="multiple"
        value={filters}
        options={tagsObj}
        onChange={(value) => setFilters(value)}/>


        <div className="mx-1 my-1">

        <Input
        value={search}
        placeholder="Search"
        className="w-[60%] my-2 mx-2"
        onChange={(e) => setSearch(e.target.value)}/>

        </div>

        <Table
          loading={LoadingState}
          dataSource={filteredData} 
          columns={columns}
        />
      </div>
    );

}

export default List;