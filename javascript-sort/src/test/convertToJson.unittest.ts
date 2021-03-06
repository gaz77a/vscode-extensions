/* eslint-disable @typescript-eslint/naming-convention */
import { it } from 'mocha';
import { expect } from 'chai';
import {
  convertJavascriptObjectStringToJson,
  convertSelectedTextToJson,
} from '../convertToJson';

describe('convertJavascriptObjectStringToJson', () => {
  it('empty Object', () => {
    // Arrange
    const selectedText = '{}';

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal('{}');
  });

  it('single key', () => {
    // Arrange
    const selectedText = '{ someKey: "someValue"}';

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal('{ "someKey": "someValue"}');
  });

  it('single key with variable value', () => {
    // Arrange
    const selectedText = '{ someKey: SomeEnum.SomeValue }';

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(
      '{ "someKey": "__VARIABLE_VALUE__SomeEnum.SomeValue" }'
    );
  });

  it('single key with value from new class', () => {
    // Arrange
    const selectedText = '{ someKey: new SomeClass() }';

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(
      '{ "someKey": "__VARIABLE_VALUE__new SomeClass()" }'
    );
  });

  it('single key with a single line comment before it', () => {
    // Arrange
    const selectedText = `{
      // Single line comment
      someKey: "someValue"
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "someKey__DUMMY_COMMENT_KEY__": "__DUMMY_COMMENT_VALUE__// Single line comment",
      "someKey": "someValue"
    }`);
  });

  it('key in shorthand', () => {
    // Arrange
    const selectedText = `{
      someKey,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{
      "someKey": "__DUMMY_VALUE__"
    }`)
    );
  });

  it('key in shorthand with trailing whitespace', () => {
    // Arrange
    const whitespace = '    ';
    const selectedText = `{
      someKey,${whitespace}
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{
      "someKey": "__DUMMY_VALUE__"${whitespace}
    }`)
    );
  });

  it('variable in value', () => {
    // Arrange
    const selectedText = `{
      someKey: SomeEnum.SomeValue,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{
      "someKey": "__VARIABLE_VALUE__SomeEnum.SomeValue"
    }`)
    );
  });

  it('spread operator', () => {
    // Arrange
    const selectedText = `{ 
      ...someSpread,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{ 
      "!!!___1someSpread": "__DUMMY_SPREAD_VALUE__"
    }`);
  });

  it('spread operator with trailing whitespace', () => {
    // Arrange
    const whitespace = '    ';
    const selectedText = `{ 
      ...someSpread,${whitespace}
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{ 
      "!!!___1someSpread": "__DUMMY_SPREAD_VALUE__"${whitespace}
    }`)
    );
  });

  it('spread operator with multiple parts', () => {
    // Arrange
    const selectedText = `{ 
      ...someSpread.secondPart.thirdPart,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{ 
      "!!!___1someSpread.secondPart.thirdPart": "__DUMMY_SPREAD_VALUE__"
    }`)
    );
  });

  it('array', () => {
    // Arrange
    const selectedText = `{
      someArray: ["b", "a"],
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "someArray": ["b", "a"]
    }`);
  });

  it('variable in Key', () => {
    // Arrange
    const selectedText = `{ 
      [someVariableKey]: 'someValue',
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{ 
      "someVariableKey__DUMMY_VARIABLE_KEY__": "someValue"
    }`);
  });

  it('variable in key with a single line comment before it', () => {
    // Arrange
    const selectedText = `{
      // Single line comment
      [someVariableKey]: "someValue"
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "someVariableKey__DUMMY_COMMENT_KEY__": "__DUMMY_COMMENT_VALUE__// Single line comment",
      "someVariableKey__DUMMY_VARIABLE_KEY__": "someValue"
    }`);
  });

  it('three shorthand keys', () => {
    // Arrange
    const selectedText = `{
      someKey1,
      someKey2,
      someKey3,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "someKey1": "__DUMMY_VALUE__",
      "someKey2": "__DUMMY_VALUE__",
      "someKey3": "__DUMMY_VALUE__"
    }`);
  });

  it('three spread operators', () => {
    // Arrange
    const selectedText = `{
      ...someSpreada,
      ...someSpreadb,
      ...someSpreadc,
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "!!!___1someSpreada": "__DUMMY_SPREAD_VALUE__",
      "!!!___2someSpreadb": "__DUMMY_SPREAD_VALUE__",
      "!!!___3someSpreadc": "__DUMMY_SPREAD_VALUE__"
    }`);
  });

  it('3 levels of nested objects', () => {
    // Arrange
    const selectedText = `{
      someKey3: 'someValue3',
      someKey1: 'someValue1',
      someKey2: {
        someNestedKey6: 'someNestedValue6',
        someNestedKey4: {
          someNestedKey9: 'someNestedValue9',
          someNestedKey7: 'someNestedValue7',
          someNestedKey8: 'someNestedValue8',
        },
        someNestedKey5: 'someNestedValue5',
      },
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(jsonString).to.equal(`{
      "someKey3": "someValue3",
      "someKey1": "someValue1",
      "someKey2": {
        "someNestedKey6": "someNestedValue6",
        "someNestedKey4": {
          "someNestedKey9": "someNestedValue9",
          "someNestedKey7": "someNestedValue7",
          "someNestedKey8": "someNestedValue8"
        },
        "someNestedKey5": "someNestedValue5"
      }
    }`);
  });

  it('complex example', () => {
    // Arrange
    const selectedText = `{
      b: {
        ...zzzSomeSpread,
        ...aaaSomeSpread,
        someShortHand,
        someKey: SomeEnum.SomeValue,
        d: "fred",
        // Single line comment for g
        g: ["m", 2, "j", { q: 3, h: 2 }],
        c: "mary",
      },
      a: "john",
      // Single line comment for VariableInKey
      [VariableInKey]: 'a value',
    }`;

    // Act
    const jsonString = convertJavascriptObjectStringToJson(selectedText);

    // Assert
    expect(JSON.stringify(jsonString)).to.equal(
      JSON.stringify(`{
      "b": {
        "!!!___1zzzSomeSpread": "__DUMMY_SPREAD_VALUE__",
        "!!!___2aaaSomeSpread": "__DUMMY_SPREAD_VALUE__",
        "someShortHand": "__DUMMY_VALUE__",
        "someKey": "__VARIABLE_VALUE__SomeEnum.SomeValue",
        "d": "fred",
        "g__DUMMY_COMMENT_KEY__": "__DUMMY_COMMENT_VALUE__// Single line comment for g",
        "g": ["m", 2, "j", { "q": "__VARIABLE_VALUE__3", "h": "__VARIABLE_VALUE__2" }],
        "c": "mary"
      },
      "a": "john",
      "VariableInKey__DUMMY_COMMENT_KEY__": "__DUMMY_COMMENT_VALUE__// Single line comment for VariableInKey",
      "VariableInKey__DUMMY_VARIABLE_KEY__": "a value"
    }`)
    );
  });
});

describe('convertSelectedTextToJson', () => {
  it('empty Object', () => {
    // Arrange
    const selectedText = '{}';

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({});
  });

  it('single key', () => {
    // Arrange
    const selectedText = '{ someKey: "someValue"}';

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({ someKey: 'someValue' });
  });

  it('key in shorthand', () => {
    // Arrange
    const selectedText = `{ 
      someKey,
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({ someKey: '__DUMMY_VALUE__' });
  });

  it('spread operator', () => {
    // Arrange
    const selectedText = `{ 
      "___1someSpread": "__DUMMY_SPREAD_VALUE__" 
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({ ___1someSpread: '__DUMMY_SPREAD_VALUE__' });
  });

  it('array', () => {
    // Arrange
    const selectedText = `{
      "someArray": ["b", "a"]
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({ someArray: ['b', 'a'] });
  });

  it('variable in Key', () => {
    // Arrange
    const selectedText = `{ 
      [someVariableKey]: "someValue"
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({
      someVariableKey__DUMMY_VARIABLE_KEY__: 'someValue',
    });
  });

  it('three shorthand keys', () => {
    // Arrange
    const selectedText = `{ 
      someKey1,
      someKey2,
      someKey3,
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({
      someKey1: '__DUMMY_VALUE__',
      someKey2: '__DUMMY_VALUE__',
      someKey3: '__DUMMY_VALUE__',
    });
  });

  it('three spread operators', () => {
    // Arrange
    const selectedText = `{ 
      "___1someSpreada": "__DUMMY_SPREAD_VALUE__", 
      "___2someSpreadb": "__DUMMY_SPREAD_VALUE__", 
      "___3someSpreadc": "__DUMMY_SPREAD_VALUE__" 
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({
      ___1someSpreada: '__DUMMY_SPREAD_VALUE__',
      ___2someSpreadb: '__DUMMY_SPREAD_VALUE__',
      ___3someSpreadc: '__DUMMY_SPREAD_VALUE__',
    });
  });

  it('3 levels of nested objects', () => {
    // Arrange
    const selectedText = `{
      "someKey3": "someValue3",
      "someKey1": "someValue1",
      "someKey2": {
        "someNestedKey6": "someNestedValue6",
        "someNestedKey4": {
          "someNestedKey9": "someNestedValue9",
          "someNestedKey7": "someNestedValue7",
          "someNestedKey8": "someNestedValue8"
        },
        "someNestedKey5": "someNestedValue5"
      }
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({
      someKey3: 'someValue3',
      someKey1: 'someValue1',
      someKey2: {
        someNestedKey6: 'someNestedValue6',
        someNestedKey4: {
          someNestedKey9: 'someNestedValue9',
          someNestedKey7: 'someNestedValue7',
          someNestedKey8: 'someNestedValue8',
        },
        someNestedKey5: 'someNestedValue5',
      },
    });
  });

  it('complex example', () => {
    // Arrange
    const selectedText = `{
      "b": {
        "___1zzzSomeSpread": "__DUMMY_SPREAD_VALUE__", 
        "___2aaaSomeSpread": "__DUMMY_SPREAD_VALUE__",
        "someShortHand": "__DUMMY_VALUE__",
        "d": "fred",
        "g__DUMMY_COMMENT_KEY__": "__DUMMY_COMMENT_VALUE__// Single line comment for g",  
        "g": ["m", 2, "j", {
          "q": 3,
          "h": 2 
        }],
        "c": "mary"
      },
      "a": "john"
    }`;

    // Act
    const jsonString = convertSelectedTextToJson(selectedText);

    // Assert
    expect(jsonString).to.eql({
      b: {
        ___1zzzSomeSpread: '__DUMMY_SPREAD_VALUE__',
        ___2aaaSomeSpread: '__DUMMY_SPREAD_VALUE__',
        someShortHand: '__DUMMY_VALUE__',
        d: 'fred',
        g__DUMMY_COMMENT_KEY__:
          '__DUMMY_COMMENT_VALUE__// Single line comment for g',
        g: ['m', 2, 'j', { q: 3, h: 2 }],
        c: 'mary',
      },
      a: 'john',
    });
  });
});
