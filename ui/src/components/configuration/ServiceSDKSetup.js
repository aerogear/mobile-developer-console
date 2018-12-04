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
            const command = simpleString ? commandHelp : `${commandHelp[0]}\n\n${commandHelp[1]}`;
            return (
              <li key={`cmd-${index}`}>
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
