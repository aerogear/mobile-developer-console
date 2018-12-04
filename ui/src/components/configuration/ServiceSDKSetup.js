import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../common/CodeBlock';

export const ServiceSDKSetup = ({ docs = {} }) => {
  const { introduction, commands } = docs;
  return (
    <li>
      {introduction ? (
        <h4>
          <ReactMarkdown source={introduction} renderers={{ code: CodeBlock }} />
        </h4>
      ) : (
        <React.Fragment />
      )}
      <ul>
        {commands ? (
          commands.map((commandHelp, index) => {
            const simpleString = typeof commandHelp === 'string';
            const command = simpleString ? '' : commandHelp[1];
            return (
              <li key={`cmd-${index}`}>
                <span>{simpleString ? commandHelp : commandHelp[0]}</span>
                <ReactMarkdown source={command} skipHtml escapeHtml renderers={{ code: CodeBlock }} />
              </li>
            );
          })
        ) : (
          <React.Fragment />
        )}
      </ul>
    </li>
  );
};
