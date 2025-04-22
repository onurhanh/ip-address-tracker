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
  TableRow, } from '@/components/ui/table';

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
    <main className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center my-4">IP Address Tracker</h1>
      <div className="flex gap-2 mb-4 ">
        <Input
          type="text"
          placeholder="Enter an IP address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border p-2 rounded w-64"
        />
        <Button
          onClick={handleIpSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ara
        </Button>
      </div>

      {errorMessage && (
        <p className="text-red-600 mb-4">{errorMessage}</p>
      )}


      {ipData && (
        <div className="relative w-full h-screen mt-15">
          <MapView
            className="w-full h-full"
            lat={parseFloat(ipData.latitude)}
            lng={parseFloat(ipData.longitude)}
          />

          <Card
            className="absolute flex flex-row transform top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded shadow-lg p-4"
          >
            <Table>
              <TableHeader className="w-[100px]">
                <TableRow>
                  <TableHead className="w-[100px]">
                    IP ADRESS
                  </TableHead>
                  <TableHead>
                    LOCATION
                  </TableHead>
                  <TableHead>
                    TIMEZONE
                  </TableHead>
                  <TableHead>
                    ISP
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{ipData.ip}</TableCell>
                  <TableCell>{ipData.country_name},{ipData.city}</TableCell>
                  <TableCell>{ipData.timezone}</TableCell>
                  <TableCell>{ipData.org}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </main>

  );
}
