import React from 'react';
import ReactMarkdown from 'react-markdown';

export const ServiceSDKSetup = ({ docs = {} }) => {
  const { introduction, commands } = docs;
  return (
    <li>
      {introduction ? <h4>{introduction}</h4> : <React.Fragment />}
      <ul>
        {commands ? (
          commands.map((commandHelp, index) => (
            <li>
              <ReactMarkdown>{commandHelp[0]}</ReactMarkdown>
              <pre>{commandHelp[1]}</pre>
            </li>
          ))
        ) : (
          <React.Fragment />
        )}
      </ul>
    </li>
  );
};
