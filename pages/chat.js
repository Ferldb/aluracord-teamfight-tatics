import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NDA2MywiZXhwIjoxOTU4ODYwMDYzfQ.nvBx8Tf52mv1qBg7m07UfvVzwoWCONQGur0SPZZ-Vkg';
const SUPABASE_URL = 'https://wbnjtisdxxslmfkomylg.supabase.co';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY );

export default function ChatPage() {

    function realTimeMessage(addMessage){
        return supabase
        .from('mensagens')
        .on('INSERT',(response) =>{
             addMessage(response.new);
        }).subscribe();
    }
    
    const router = useRouter();
    const usuarioLogado = router.query.username;

    const [mensagem, setMensagem] = useState('');
    const [listaDeMensagens, setListaDeMensagens] = useState([]);

    useEffect(()=>{
        supabase
        .from('mensagens')
        .select('*')
        .order('id', {ascending: false})
        .then(({data}) => {
            setListaDeMensagens(data);
        });

        realTimeMessage((novaMensagem) =>{
           setListaDeMensagens((valorDaLista) =>{
               return[
                   novaMensagem,
                   ...valorDaLista,
               ]
           });
        });
    },[])

    function handleNovaMensagem(novaMensagem) {

        const mensagem = {
            texto: novaMensagem,
            de: usuarioLogado,
        };

        supabase
        .from('mensagens')
        .insert([mensagem])
        .then(({data}) => {
            
        });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://cdn.wccftech.com/wp-content/uploads/2020/08/TeamFight-Tactics-Fates-Keyart-scaled.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => setMensagem(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                            <ButtonSendSticker
                                onStickerClick={(sticker) =>{
                                    handleNovaMensagem(':sticker:' + sticker);
                                }}
                            />
                            
                        <Button
                            iconName="FaPaperPlane"
                            buttonColors={{
                                contrastColor: '#FFFFFF',
                                mainColor: '#52667A',
                            }}
                            styleSheet={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '50px',
                                minHeight: '50px',
                                fontSize: '16px',
                                marginBottom: '8px',
                            }}
                            onClick={() =>{
                                handleNovaMensagem(mensagem);
                            }}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') ? 
                        (<Image 
                            src={mensagem.texto.replace(':sticker:','')}
                            styleSheet={{
                                width: '150px',
                                height: '150px',    
                            }}
                            
                            />) 
                        : (mensagem.texto)}
                    </Text>
                );
            })}


        </Box>
    )
}