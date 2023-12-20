import { Stack, TextField } from '@ke-design/components';
import { useState } from 'react';
import { matchedProfile } from './dashboard/data';
import { text } from 'stream/consumers';

export default function DashBoardCLevelPopUp() {
  const [searchText, setSearchText] = useState<any>();

  const searchHighlight = (text: any, search: any) => {
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part: any, index: number) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchText(value);
  };
  return (
    <>
      <TextField id="searchBar" name="searchBar" onChange={onchangeInputHandler} value={searchText}></TextField>

      {matchedProfile.map((profile) => (
        <div>
          <Stack>
            <div>
              {searchText && profile.skypassNm.toLowerCase().includes(searchText.toLowerCase())
                ? searchHighlight(profile.skypassNm, searchText)
                : profile.skypassNm}
            </div>
            <div>
              {searchText && profile.name.toLowerCase().includes(searchText.toLowerCase())
                ? searchHighlight(profile.name, searchText)
                : profile.name}
            </div>
          </Stack>
        </div>
      ))}
    </>
  );
}
