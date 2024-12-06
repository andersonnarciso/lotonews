export const LOTERIAS = {
  megasena: {
    nome: 'Mega-Sena',
    cor: '#209869',
    corSecundaria: '#209869',
    bola: {
      cor: '#209869',
      texto: '#ffffff'
    }
  },
  lotofacil: {
    nome: 'Lotofácil',
    cor: '#930089',
    corSecundaria: '#930089',
    bola: {
      cor: '#930089',
      texto: '#ffffff'
    }
  },
  quina: {
    nome: 'Quina',
    cor: '#260085',
    corSecundaria: '#260085',
    bola: {
      cor: '#260085',
      texto: '#ffffff'
    }
  },
  lotomania: {
    nome: 'Lotomania',
    cor: '#F78100',
    corSecundaria: '#F78100',
    bola: {
      cor: '#F78100',
      texto: '#ffffff'
    }
  },
  timemania: {
    nome: 'Timemania',
    cor: '#00FF48',
    corSecundaria: '#00FF48',
    bola: {
      cor: '#00FF48',
      texto: '#000000'
    }
  }
};

export const formatarNumero = (numero) => {
  return numero.toString().padStart(2, '0');
};

export const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
