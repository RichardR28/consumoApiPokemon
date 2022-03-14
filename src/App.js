import React, { useState, useEffect } from 'react';
import './App.css';
const _ = require('lodash');

export default function App() {
  const [val, setVal] = useState('');
  const [pokeList, setPokeList] = useState([]);
  const [effects, setEffects] = useState({});

  async function buscaHabilidade(url, name) {
    console.log(name);
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        _.filter(data.effect_entries, (ele) => {
          if (ele?.language?.name === 'en') {
            effects[name] = ele.effect;
            setEffects({ ...effects });
          }
        });
      });
  }

  function busca() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${val.toLowerCase()}`)
      .then((req) => {
        console.log(req);
        if (req.status === 404 || !val) {
          return { status: 404 };
        } else {
          return req.json();
        }
      })
      .then((data) => {
        if (data.status === 404) {
          document.getElementById('msg_error').style.display = 'flex';
        } else {
          document.getElementById('msg_error').style.display = 'none';
          if (data?.abilities) {
            const aux = [];
            data.abilities.forEach((element) => {
              aux.push(element.ability);
              buscaHabilidade(element.ability.url, element.ability.name);
            });
            setPokeList(aux);
          }
        }
      });
  }

  useEffect(() => {
    if (
      pokeList?.length > 0 &&
      pokeList?.length === Object.keys(effects)?.length
    ) {
      document.getElementById('infos').style.display = 'flex';
    }
  }, [effects, pokeList?.length]);

  useEffect(() => {
    document.getElementById('pokemon').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        busca();
      }
    });
    window.onload = () => {
      document.getElementById('pokemon').focus();
    };
  });

  return (
    <div
      className="App"
      style={{
        width: '100%',
        fontFamily: 'monospace',
        marginTop: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              margin: '5px 0',
            }}
          >
            Pokemon:
          </div>
          <div
            style={{
              display: 'flex',
              minWidth: 200,
              width: '90%',
              maxWidth: 350,
              justifyContent: 'center',
              margin: '10px 0',
            }}
          >
            <input
              id="pokemon"
              name="pokemon"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              style={{
                height: 25,
                width: '90%',
              }}
            />
          </div>
          <button className="search" onClick={() => busca()}>
            Buscar
          </button>
        </div>
      </div>
      <hr style={{ margin: '25px 0px' }} />
      <div id="infos" className="info" style={{ display: 'none' }}>
        <div>
          <table>
            <thead>
              <tr className="column">
                <th style={{ width: '30%' }}>Habilidade</th>
                <th style={{ width: '70%' }}>Efeito</th>
              </tr>
            </thead>
            <tbody>
              {pokeList.length > 0 &&
                _.orderBy(pokeList, ['name']).map((pos) => {
                  return (
                    <tr
                      className="tableRow"
                      key={pos.name}
                      style={{ textAlign: 'center' }}
                    >
                      <td>{pos.name}</td>
                      <td style={{ textAlign: 'left' }}>{effects[pos.name]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        id="msg_error"
        style={{
          display: 'none',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '0px 30px',
        }}
      >
        <div style={{ fontSize: 60, color: '#e3350d', fontWeight: 700 }}>
          Ops,
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            display: 'flex',
            textAlign: 'center',
          }}
        >
          Não foi encontrado nenhum pokemon com esse nome :(
        </div>
      </div>
    </div>
  );
}
