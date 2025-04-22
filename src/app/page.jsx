"use client"
import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Home() {
  const [ipData, setIpData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipJson = await ipRes.json();

        const dataRes = await fetch(`https://ipapi.co/${ipJson.ip}/json/`);
        const dataJson = await dataRes.json();
        setIpData(dataJson);
      } catch (err) {
        setErrorMessage('Başlangıç verileri alınamadı.');
      }
    };

    fetchInitialData();
  }, []);

  const handleIpSearch = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Lütfen bir IP adresi girin.');
      return;
    }

    try {
      const res = await fetch(`https://ipapi.co/${inputValue}/json/`);
      const data = await res.json();

      if (data.error) {
        setErrorMessage('Geçersiz IP adresi.');
      } else {
        setErrorMessage('');
        setIpData(data);
      }
    } catch (err) {
      setErrorMessage('IP adresi sorgulanamadı.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleIpSearch();
    }
  };

  return (
    <main className="flex flex-col items-center bg-[url('/images/bg-image.svg')] bg-no-repeat xl:bg-contain font-sans">
      <h1 className="text-2xl font-bold text-center my-4 text-[#ffffff]">IP Address Tracker</h1>
      <div className="flex gap-2 mb-4 relative">
        <Input
          type="text"
          placeholder="Enter an IP address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border text-white p-2 rounded-lg sm:w-94"
        />
        <Button
          onClick={handleIpSearch}
          className="bg-primary right-0 absolute  text-white px-4 py-2 rounded-r-lg hover:bg-gray-700"
        >
          Ara
        </Button>
      </div>

      {errorMessage && (
        <p className="text-red-600 mb-4">{errorMessage}</p>
      )}


      {ipData && (
        <div className="relative w-full h-screen sm:mt-20 mt-25">
          <MapView
            className="w-full h-full"
            lat={parseFloat(ipData.latitude)}
            lng={parseFloat(ipData.longitude)}
          />
          <div
            className="absolute sm:grid sm:grid-cols-4 sm:justify-center flex-col  transform top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 backdrop-blur-md shadow-lg sm:p-4 p-3 sm:flex-row flex gap-3 sm:gap-6 rounded-xl max-h-[30%] sm:max-h-[20%] border sm:py-6 sm:text-[12px] xl:text-[16px] text-[10px] sm:w-[75%] w-3xs text-wrap text-[#FFFFFF] "
          >
            <div className='flex flex-col sm:text-start text-center  w-full sm:text-wrap sm:border-r'>
              <h5 className="mb-1 sm:mt-1">IP ADRESS</h5>
              <h5 className="font-bold sm:text-wrap">{ipData.ip}</h5>
            </div>
            <div className='flex flex-col   sm:text-start text-center w-full sm:border-r'>
              <h5 className="mb-1 sm:mt-1">LOCATION</h5>
              <h5 className=" font-bold">{ipData.country_name},{ipData.city}</h5>
            </div>
            <div className='flex flex-col sm:text-start text-center w-full sm:border-r'>
              <h5 className=" mb-1 sm:mt-1">TIMEZONE</h5>
              <h5 className="font-bold">{ipData.timezone}</h5>
            </div>
            <div className='flex flex-col sm:text-start text-center w-full '>
              <h5 className=" mb-1 sm:mt-1">ISP</h5>
              <h5 className="font-bold">{ipData.org}</h5>
            </div>
          </div>
        </div>
      )}
    </main>

  );
}
