import React, { useEffect, useRef,useState } from 'react';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

const AIEngineerWorkspace = () => {
  const blocklyDiv = useRef(null);
  const [pythonCode, setPythonCode] = useState('# Your Python code will appear here');
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      // Load Dataset Block
      Blockly.Blocks['load_dataset'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Load Dataset")
              .appendField(new Blockly.FieldDropdown([
                ["Twitter Sentiment Dataset", "TWITTER"],
                ["IMDB Reviews", "IMDB"],
                ["Amazon Reviews", "AMAZON"]
              ]), "DATASET");
          this.setNextStatement(true);
          this.setPreviousStatement(true);
          this.setColour(120);
          this.setTooltip("Load a sentiment analysis dataset");
        }
      };
      pythonGenerator.forBlock['load_dataset'] = function(block) {
        const dataset = block.getFieldValue('DATASET');
        return `# Load ${dataset} dataset
from datasets import load_dataset
dataset = load_dataset("${dataset.toLowerCase()}")
`;
      };


      // Preprocess Text Block
      Blockly.Blocks['preprocess_text'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Preprocess Text");
          this.appendStatementInput("PREPROCESSING_STEPS")
              .appendField("steps");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(160);
          this.setTooltip("Preprocess the text data");
        }
      };
      pythonGenerator.forBlock['preprocess_text'] = function(block) {
        const steps = pythonGenerator.statementToCode(block, 'PREPROCESSING_STEPS');
        return `# Text preprocessing
import string
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
${steps}    return text

processed_data = dataset.map(lambda x: preprocess_text(x['text']))
`;
      };


      // Preprocessing Steps
      Blockly.Blocks['preprocessing_step'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Apply")
              .appendField(new Blockly.FieldDropdown([
                ["Remove Punctuation", "REMOVE_PUNCT"],
                ["Convert to Lowercase", "LOWERCASE"],
                ["Remove Stop Words", "REMOVE_STOP"],
                ["Tokenize", "TOKENIZE"]
              ]), "STEP");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(160);
        }
      };

      pythonGenerator.forBlock['preprocessing_step'] = function(block) {
        const step = block.getFieldValue('STEP');
        const stepCode = {
          'REMOVE_PUNCT': '    text = text.translate(str.maketrans("", "", string.punctuation))',
          'LOWERCASE': '    text = text.lower()',
          'REMOVE_STOP': '    text = " ".join([word for word in text.split() if word not in stop_words])',
          'TOKENIZE': '    text = text.split()'
        };
        return stepCode[step] + '\n';
      };


      // Create Model Block
      Blockly.Blocks['create_model'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Create Model")
              .appendField(new Blockly.FieldDropdown([
                ["LSTM", "LSTM"],
                ["Simple Neural Network", "NN"],
                ["Naive Bayes", "NB"]
              ]), "MODEL_TYPE");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(230);
        }
      };

      pythonGenerator.forBlock['create_model'] = function(block) {
        const modelType = block.getFieldValue('MODEL_TYPE');
        const modelCode = {
          'LSTM': `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Embedding

model = Sequential([
    Embedding(vocab_size, 32),
    LSTM(64),
    Dense(1, activation='sigmoid')
])`,
          'NN': `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

model = Sequential([
    Dense(64, activation='relu', input_shape=(vocab_size,)),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])`,
          'NB': `from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()`
        };
        return modelCode[modelType] + '\n';
      };


      // Train Model Block
      Blockly.Blocks['train_model'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Train Model");
          this.appendValueInput("EPOCHS")
              .setCheck("Number")
              .appendField("epochs");
          this.appendValueInput("BATCH_SIZE")
              .setCheck("Number")
              .appendField("batch size");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(230);
        }
      };

      pythonGenerator.forBlock['train_model'] = function(block) {
        const epochs = pythonGenerator.valueToCode(block, 'EPOCHS', pythonGenerator.ORDER_ATOMIC) || '10';
        const batchSize = pythonGenerator.valueToCode(block, 'BATCH_SIZE', pythonGenerator.ORDER_ATOMIC) || '32';
        
        return `# Prepare data for training
      from sklearn.model_selection import train_test_split
      X_train, X_test, y_train, y_test = train_test_split(processed_data['text'], processed_data['label'], test_size=0.2)
      
      # Train the model
      model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
      history = model.fit(
          X_train,
          y_train,
          epochs=${epochs},
          batch_size=${batchSize},
          validation_split=0.2
      )
      
      print("Training completed!")\n`;
      };


      // Evaluate Model Block
      Blockly.Blocks['evaluate_model'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Evaluate Model");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(290);
        }
      };

      pythonGenerator.forBlock['evaluate_model'] = function(block) {
        return `# Evaluate model performance
      from sklearn.metrics import accuracy_score, classification_report
      
      # Make predictions on test set
      y_pred = model.predict(X_test)
      if hasattr(model, 'predict_proba'):
          y_pred = (model.predict_proba(X_test) > 0.5).astype(int)
      else:
          y_pred = (y_pred > 0.5).astype(int)
      
      # Print evaluation metrics
      print("\\nModel Evaluation:")
      print("Accuracy:", accuracy_score(y_test, y_pred))
      print("\\nDetailed Classification Report:")
      print(classification_report(y_test, y_pred))\n`;
      };


      // Test Prediction Block
      Blockly.Blocks['test_prediction'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Predict Sentiment");
          this.appendValueInput("TEXT")
              .setCheck("String")
              .appendField("text");
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(290);
        }
      };

      pythonGenerator.forBlock['test_prediction'] = function(block) {
        const text = pythonGenerator.valueToCode(block, 'TEXT', pythonGenerator.ORDER_ATOMIC) || '"This is a great product!"';
        
        return `# Function to make predictions on new text
      def predict_sentiment(text):
          # Preprocess the input text
          processed_text = preprocess_text(text)
          
          # Make prediction
          prediction = model.predict([processed_text])[0]
          if hasattr(model, 'predict_proba'):
              prediction = model.predict_proba([processed_text])[0]
          
          # Convert prediction to sentiment
          sentiment = "Positive" if prediction > 0.5 else "Negative"
          confidence = max(prediction, 1 - prediction) * 100
          
          return sentiment, confidence
          # Test the model with sample text
          test_text = ${text}
          sentiment, confidence = predict_sentiment(test_text)
          print(f"Text: {test_text}")
          print(f"Predicted Sentiment: {sentiment}")
          print(f"Confidence: {confidence:.2f}%")\n`;
          };
      const toolbox = {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Data",
            colour: "#5ba55b",
            contents: [
              {
                kind: "block",
                type: "load_dataset"
              }
            ]
          },
          {
            kind: "category",
            name: "Preprocessing",
            colour: "#5b67a5",
            contents: [
              {
                kind: "block",
                type: "preprocess_text"
              },
              {
                kind: "block",
                type: "preprocessing_step"
              }
            ]
          },
          {
            kind: "category",
            name: "Model",
            colour: "#a55b80",
            contents: [
              {
                kind: "block",
                type: "create_model"
              },
              {
                kind: "block",
                type: "train_model"
              }
            ]
          },
          {
            kind: "category",
            name: "Evaluation",
            colour: "#a5745b",
            contents: [
              {
                kind: "block",
                type: "evaluate_model"
              },
              {
                kind: "block",
                type: "test_prediction"
              }
            ]
          }
        ]
      };

      // Create workspace
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        scrollbars: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
      });

      workspaceRef.current = workspace;

      // Add change listener to update Python code
      workspace.addChangeListener(() => {
        const code = pythonGenerator.workspaceToCode(workspace);
        setPythonCode(code || '# Your Python code will appear here');
      });
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div ref={blocklyDiv} className="w-1/2 h-full border-r border-gray-300" />
      <div className="w-1/2 h-full bg-gray-900 text-white p-4 overflow-auto">
        <pre className="font-mono text-sm">
          <code>{pythonCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default AIEngineerWorkspace;